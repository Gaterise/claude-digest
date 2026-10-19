import { Timestamp } from "firebase-admin/firestore";

export type DigestCategory =
  | "new_feature"
  | "improvement"
  | "bug_fix"
  | "deprecation"
  | "breaking_change"
  | "other";

export interface ChangeLog {
  id: string;
  sourceUrl: string;
  rawContent: string;
  tagName: string;
  version: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  contentHash: string;
  status: "pending" | "processing" | "processed" | "error";
  errorMessage: string | null;
}

export interface DigestArticle {
  id: string;
  changeLogId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  categories: DigestCategory[];
  sourceUrl: string;
  originalVersion: string | null;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "published" | "draft" | "archived";
}

/** Firestore に保存する際に id を除いた型 */
export type ChangeLogCreate = Omit<ChangeLog, "id">;
export type DigestArticleCreate = Omit<DigestArticle, "id">;

/** X / Threads で話題の AI トレンドトピック（Gemini により自動生成） */
export interface TrendItem {
  /** トピック名（例: "GPT-5の新機能が話題"） */
  title: string;
  /** 1〜2文の日本語解説 */
  summary: string;
  /** X / Threads の検索リンク生成に使うキーワード */
  keyword: string;
}

export interface AiTrends {
  items: TrendItem[];
  generatedAt: Timestamp;
}

/** Claude 現行モデル（モデル比較ページ用） */
export interface ClaudeModel {
  family: string;
  name: string;
  modelId: string;
  /** 位置づけ（例: "高性能"） */
  tagline: string;
  context: string;
  maxOutput: string;
  /** 100万トークンあたりの入力価格（例: "$5.00"） */
  priceInput: string;
  priceOutput: string;
  description: string;
  strengths: string[];
  /** 使い分けガイドの見出し（例: "迷ったら Sonnet。"） */
  guideTitle: string;
  guideText: string;
}

export interface BenchmarkScore {
  model: string;
  score: number;
  /** 出典 URL（http/https 必須） */
  sourceUrl: string;
}

export interface Benchmark {
  name: string;
  description: string;
  /** "%"、"Elo" など。単位なしは空文字 */
  unit: string;
  higherIsBetter: boolean;
  scores: BenchmarkScore[];
}

/** Claude 以外で話題の AI モデル */
export interface TrendingModel {
  name: string;
  provider: string;
  releaseDate: string;
  summary: string;
  highlights: string[];
  /** 公式情報 URL（不正な場合は null） */
  url: string | null;
}

/** モデル比較ページの最新スナップショット（区分ごとに最終更新日時を持つ） */
export interface ModelComparisonData {
  claudeModels: ClaudeModel[];
  claudeNote: string | null;
  claudeModelsUpdatedAt: Date | null;
  benchmarks: Benchmark[];
  benchmarksUpdatedAt: Date | null;
  trendingModels: TrendingModel[];
  trendingModelsUpdatedAt: Date | null;
}
