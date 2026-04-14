/**
 * Claude Digest API - 自動生成型定義
 * openapi.yaml から手動マッピング（orval 生成の代替）
 * ⚠️ openapi.yaml を変更した場合はこのファイルも更新すること
 */

export type DigestCategory =
  | "new_feature"
  | "improvement"
  | "bug_fix"
  | "deprecation"
  | "breaking_change"
  | "other";

export interface DigestArticleSummary {
  id: string;
  title: string;
  keyPoints: string[];
  categories: DigestCategory[];
  sourceUrl: string;
  originalVersion?: string | null;
  publishedAt: string;
  createdAt: string;
}

export interface DigestArticleDetail extends DigestArticleSummary {
  summary: string;
}

export interface ListDigestsResponse {
  items: DigestArticleSummary[];
  total: number;
  nextCursor?: string | null;
}

export interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface ListDigestsParams {
  limit?: number;
  cursor?: string;
  category?: DigestCategory;
  from?: string;
  to?: string;
}
