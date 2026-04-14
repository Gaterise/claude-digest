import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";

// Firebase Admin 初期化
initializeApp();

// HTTP API Function
export const api = onRequest(
  { region: "asia-northeast1", cors: true, secrets: ["ANTHROPIC_API_KEY"] },
  async (req, res) => {
    // Dynamic import to avoid cold start overhead
    const { default: app } = await import("./api/index");
    app(req, res);
  }
);

// Scheduled Scraper Function
export { scheduledScrape } from "./scraper/scheduler";
