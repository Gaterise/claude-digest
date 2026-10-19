/**
 * フロントエンド共通型定義
 * API レスポンス型は src/generated/api/ から re-export する
 */

export type {
  DigestCategory,
  DigestArticleSummary,
  DigestArticleDetail,
  ListDigestsResponse,
  ListDigestsParams,
  HealthResponse,
  ErrorResponse,
} from "@/generated/api/claudeDigestAPI";

/** カテゴリの日本語ラベルマッピング */
export const CATEGORY_LABELS: Record<string, string> = {
  new_feature: "新機能",
  improvement: "改善",
  bug_fix: "バグ修正",
  deprecation: "非推奨",
  breaking_change: "破壊的変更",
  other: "その他",
};

