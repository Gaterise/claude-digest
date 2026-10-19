import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import * as modelComparisonRepo from "../firestore/modelComparisonRepository";
import { createGeminiGenerators } from "./generator";
import { updateModelComparison } from "./updater";

/**
 * 毎日 JST 06:00 に Google検索グラウンディング付き Gemini で
 * Claude モデル・話題の AI モデル・ベンチマークを調べ、モデル比較ページのデータを更新する。
 * 失敗した区分は前回データを維持する。ダイジェスト記事の作成や通知は行わない。
 */
export const scheduledModelComparison = onSchedule(
  {
    schedule: "0 6 * * *",
    timeZone: "Asia/Tokyo",
    region: "asia-northeast1",
    timeoutSeconds: 900,
    memory: "512MiB",
  },
  async () => {
    logger.info("AIモデル比較更新開始");

    const previous = await modelComparisonRepo.getModelComparison();
    const { data, errors } = await updateModelComparison({
      previous,
      generators: createGeminiGenerators(),
      now: new Date(),
    });

    for (const { section, message } of errors) {
      logger.error(`AIモデル比較更新エラー（${section}）: ${message}`);
    }

    if (!data) {
      throw new Error("AIモデル比較更新: 全区分の生成に失敗したため前回データを維持します");
    }

    await modelComparisonRepo.saveModelComparison(data);
    logger.info(
      `AIモデル比較更新完了: Claude ${data.claudeModels.length} 件 / ベンチマーク ${data.benchmarks.length} 件 / 話題モデル ${data.trendingModels.length} 件（失敗区分 ${errors.length}）`
    );
  }
);
