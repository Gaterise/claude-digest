import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { generateAiTrends } from "./trendGenerator";
import * as trendRepo from "../firestore/trendRepository";

/**
 * 6時間ごとに Google検索グラウンディング付き Gemini で
 * X / Threads の AI トレンドトピックを生成し、Firestore に保存する。
 * 生成に失敗した場合は前回のトレンドがそのまま表示され続ける。
 */
export const scheduledTrends = onSchedule(
  {
    schedule: "every 6 hours",
    region: "asia-northeast1",
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async () => {
    logger.info("AIトレンド生成開始");

    try {
      const items = await generateAiTrends();
      await trendRepo.saveTrends(items);
      logger.info(`AIトレンド生成完了: ${items.length} 件`);
    } catch (error) {
      logger.error("AIトレンド生成エラー:", error);
      throw error;
    }
  }
);
