import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { Timestamp } from "firebase-admin/firestore";
import { fetchGitHubReleases } from "./githubReleaseScraper";
import { summarizeChangeLog } from "../summarizer/claudeSummarizer";
import * as changeLogRepo from "../firestore/changeLogRepository";
import * as digestRepo from "../firestore/digestRepository";

/**
 * 6時間ごとに anthropics/claude-code GitHub Releases API をポーリングし、
 * 新しいリリースがあれば AI 要約を生成してダイジェスト記事を作成する。
 */
export const scheduledScrape = onSchedule(
  {
    schedule: "every 6 hours",
    region: "asia-northeast1",
    timeoutSeconds: 300,
    memory: "512MiB",
    secrets: ["ANTHROPIC_API_KEY"],
  },
  async () => {
    logger.info("GitHub Releases ポーリング開始");

    try {
      // 1. GitHub Releases を取得（最新30件）
      const entries = await fetchGitHubReleases(30, 1);
      logger.info(`${entries.length} 件のリリースを取得`);

      let newCount = 0;

      for (const entry of entries) {
        // 2. 重複チェック & 保存
        const changeLog = await changeLogRepo.create({
          sourceUrl: entry.sourceUrl,
          rawContent: entry.rawContent,
          tagName: entry.tagName,
          version: entry.version,
          publishedAt: Timestamp.fromDate(entry.publishedAt),
          fetchedAt: Timestamp.now(),
          contentHash: entry.contentHash,
          status: "pending",
          errorMessage: null,
        });

        if (!changeLog) {
          // 重複 → スキップ
          continue;
        }

        newCount++;
        logger.info(
          `新規 ChangeLog 保存: ${changeLog.id} (${entry.tagName})`
        );

        // 3. AI 要約生成
        try {
          await changeLogRepo.updateStatus(changeLog.id, "processing");

          const result = await summarizeChangeLog(
            entry.rawContent,
            entry.title
          );

          // 4. ダイジェスト記事作成
          const article = await digestRepo.create({
            changeLogId: changeLog.id,
            title: result.title,
            summary: result.summary,
            keyPoints: result.keyPoints,
            categories: result.categories,
            sourceUrl: entry.sourceUrl,
            originalVersion: entry.version,
            publishedAt: Timestamp.fromDate(entry.publishedAt),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            status: "published",
          });

          await changeLogRepo.updateStatus(changeLog.id, "processed");
          logger.info(`ダイジェスト記事作成完了: ${article.id}`);
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "不明なエラー";
          await changeLogRepo.updateStatus(changeLog.id, "error", msg);
          logger.error(`要約生成エラー (${changeLog.id}): ${msg}`);
        }
      }

      logger.info(
        `ポーリング完了: 新規 ${newCount} 件 / 全 ${entries.length} 件`
      );
    } catch (error) {
      logger.error("GitHub Releases ポーリングエラー:", error);
      throw error;
    }
  }
);
