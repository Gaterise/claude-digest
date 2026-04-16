"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase";

/**
 * Firebase Analytics を初期化するクライアントコンポーネント。
 * measurementId が未設定またはブラウザ非対応の場合は何もしない。
 */
export function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics().catch(() => {
      // Analytics 初期化失敗はサイレントに無視
    });
  }, []);

  return null;
}
