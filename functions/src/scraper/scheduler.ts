import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { Timestamp } from "firebase-admin/firestore";
import { fetchAllGitHubReleases } from "./githubReleaseScraper";
import { summarizeChangeLog } from "../summarizer/geminiSummarizer";
import * as changeLogRepo from "../firestore/changeLogRepository";
import * as digestRepo from "../firestore/digestRepository";
import * as metaRepo from "../firestore/metaRepository";
import { sendNewDigestNotification } from "../notifications/notificationSender";
import type { ChangeLog } from "../types";

/** ChangeLog 1件をダイジェスト記事に変換する共通処理 */
async function processOneChangeLog(
  changeLog: ChangeLog,
  title: string
): Promise<void> {
  await changeLogRepo.updateStatus(changeLog.id, "processing");

  const result = await summarizeChangeLog(changeLog.rawContent, title);

  const article = await digestRepo.create({
    changeLogId: changeLog.id,
    title: result.title,
    summary: result.summary,
    keyPoints: result.keyPoints,
    categories: result.categories,
    sourceUrl: changeLog.sourceUrl,
    originalVersion: changeLog.version,
    publishedAt: changeLog.publishedAt,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: "published",
  });

  await changeLogRepo.updateStatus(changeLog.id, "processed");
  logger.info(`ダイジェスト記事作成完了: ${article.id} (${changeLog.id})`);

  // 購読者へプッシュ通知（送信失敗しても記事処理は成功扱い）
  await sendNewDigestNotification(article);
}

/**
 * 1時間ごとに anthropics/claude-code GitHub Releases API をポーリングし、
 * 新しいリリースがあれば AI 要約を生成してダイジェスト記事を作成する。
 * また、前回エラーになった ChangeLog を再処理する。
 */
export const scheduledScrape = onSchedule(
  {
    schedule: "every 1 hours",
    region: "asia-northeast1",
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async () => {
    logger.info("GitHub Releases ポーリング開始");

    try {
      // === Phase 1: エラー状態の ChangeLog を再処理 ===
      const errorLogs = await changeLogRepo.findByStatus("error");
      logger.info(`エラー状態の ChangeLog: ${errorLogs.length} 件`);

      for (const changeLog of errorLogs) {
        try {
          await processOneChangeLog(changeLog, changeLog.tagName);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "不明なエラー";
          await changeLogRepo.updateStatus(changeLog.id, "error", msg);
          logger.error(`再処理エラー (${changeLog.id}): ${msg}`);
        }
      }

      // === Phase 2: 新規 GitHub Releases を取得して保存・処理 ===
      const entries = await fetchAllGitHubReleases();
      logger.info(`${entries.length} 件のリリースを取得`);

      let newCount = 0;

      for (const entry of entries) {
        // 重複チェック & 保存（既存なら null が返る）
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

        if (!changeLog) continue; // 重複 → スキップ

        newCount++;
        logger.info(`新規 ChangeLog 保存: ${changeLog.id} (${entry.tagName})`);

        try {
          await processOneChangeLog(changeLog, entry.title);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "不明なエラー";
          await changeLogRepo.updateStatus(changeLog.id, "error", msg);
          logger.error(`要約生成エラー (${changeLog.id}): ${msg}`);
        }
      }

      // チェック完了日時を記録（フロントエンドで「最終チェック日時」として表示）
      await metaRepo.updateLastCheckedAt();

      logger.info(
        `ポーリング完了: 再処理 ${errorLogs.length} 件 / 新規 ${newCount} 件 / 全 ${entries.length} 件`
      );
    } catch (error) {
      logger.error("GitHub Releases ポーリングエラー:", error);
      throw error;
    }
  }
);
