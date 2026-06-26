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

/** カテゴリのアイコンマッピング */
export const CATEGORY_ICONS: Record<string, string> = {
  new_feature: "✨",
  improvement: "⬆️",
  bug_fix: "🐛",
  deprecation: "⚠️",
  breaking_change: "⚡",
  other: "•••",
};

/** カテゴリの色マッピング (Tailwind クラス) */
export const CATEGORY_COLORS: Record<string, string> = {
  new_feature: "bg-green-100 text-green-800",
  improvement: "bg-blue-100 text-blue-800",
  bug_fix: "bg-red-100 text-red-800",
  deprecation: "bg-yellow-100 text-yellow-800",
  breaking_change: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};
