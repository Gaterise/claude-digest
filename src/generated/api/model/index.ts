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

export interface ScrapeStatusResponse {
  lastCheckedAt: string | null;
}

export interface TrendItem {
  title: string;
  summary: string;
  keyword: string;
}

export interface TrendsResponse {
  items: TrendItem[];
  generatedAt: string | null;
}

export interface ClaudeModel {
  family: string;
  name: string;
  modelId: string;
  tagline: string;
  context: string;
  maxOutput: string;
  priceInput: string;
  priceOutput: string;
  description: string;
  strengths: string[];
  guideTitle: string;
  guideText: string;
}

export interface BenchmarkScore {
  model: string;
  score: number;
  sourceUrl: string;
}

export interface Benchmark {
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  scores: BenchmarkScore[];
}

export interface TrendingModel {
  name: string;
  provider: string;
  releaseDate: string;
  summary: string;
  highlights: string[];
  url: string | null;
}

export interface ModelComparisonResponse {
  claudeModels: ClaudeModel[];
  claudeNote: string | null;
  benchmarks: Benchmark[];
  trendingModels: TrendingModel[];
  updatedAt: {
    claudeModels: string | null;
    benchmarks: string | null;
    trendingModels: string | null;
  };
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
