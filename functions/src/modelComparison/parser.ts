import { jsonrepair } from "jsonrepair";
import type { Benchmark, BenchmarkScore, ClaudeModel, TrendingModel } from "../types";

const LIMITS = {
  claudeModels: { min: 1, max: 6 },
  strengths: { min: 1, max: 6 },
  trendingModels: { min: 3, max: 6 },
  highlights: { min: 1, max: 4 },
  benchmarks: { min: 3, max: 8 },
  candidates: 10,
} as const;

/** 期限付きで出典として不適切な Vertex AI グラウンディング中継 URL のホスト */
const GROUNDING_REDIRECT_HOST = "vertexaisearch.cloud.google.com";

/** LLM の応答テキストから JSON（オブジェクト or 配列）を抽出してパースする */
export function extractJson(text: string): unknown {
  const stripped = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  const starts = [stripped.indexOf("{"), stripped.indexOf("[")].filter((i) => i >= 0);
  if (starts.length === 0) {
    throw new Error(`応答から JSON を抽出できませんでした: ${text.slice(0, 200)}`);
  }
  const start = Math.min(...starts);
  const closer = stripped[start] === "{" ? "}" : "]";
  const end = stripped.lastIndexOf(closer);
  if (end <= start) {
    throw new Error(`応答から JSON を抽出できませんでした: ${text.slice(0, 200)}`);
  }

  const candidate = stripped.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (parseError) {
    // LLM が長い URL の転記などで JSON を崩すことがあるため、修復を試みる
    try {
      return JSON.parse(jsonrepair(candidate));
    } catch {
      const msg = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`JSON のパースに失敗しました: ${msg}（周辺: ${errorContext(candidate, msg)}）`);
    }
  }
}

/** JSON.parse のエラーメッセージの位置周辺の原文を返す（ログ調査用） */
function errorContext(text: string, message: string): string {
  const position = Number(/position (\d+)/.exec(message)?.[1] ?? 0);
  const from = Math.max(0, position - 80);
  return text.slice(from, position + 80).replace(/\s+/g, " ");
}

/** 出典として使える http/https URL か */
export function isValidSourceUrl(url: unknown): url is string {
  if (typeof url !== "string" || url.trim() === "") return false;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return parsed.hostname !== GROUNDING_REDIRECT_HOST;
  } catch {
    return false;
  }
}

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function strList(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(str).filter((s): s is string => s !== null).slice(0, max);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/** `[...]` または `{ <key>: [...] }` 形式から配列を取り出す */
function extractArray(json: unknown, key: string): unknown[] {
  if (Array.isArray(json)) return json;
  const record = asRecord(json);
  const inner = record?.[key];
  return Array.isArray(inner) ? inner : [];
}

const CLAUDE_STRING_FIELDS = [
  "family",
  "name",
  "modelId",
  "tagline",
  "context",
  "maxOutput",
  "priceInput",
  "priceOutput",
  "description",
  "guideTitle",
  "guideText",
] as const;

function toClaudeModel(raw: unknown): ClaudeModel | null {
  const r = asRecord(raw);
  if (!r) return null;

  const fields: Partial<Record<(typeof CLAUDE_STRING_FIELDS)[number], string>> = {};
  for (const key of CLAUDE_STRING_FIELDS) {
    const value = str(r[key]);
    if (value === null) return null;
    fields[key] = value;
  }

  const strengths = strList(r.strengths, LIMITS.strengths.max);
  if (strengths.length < LIMITS.strengths.min) return null;

  return { ...(fields as Omit<ClaudeModel, "strengths">), strengths };
}

/** Claude 現行モデルの応答（`{ models: [...], note: "..." }`）を検証・正規化する */
export function parseClaudeModels(text: string): { models: ClaudeModel[]; note: string | null } {
  const json = extractJson(text);
  const models = extractArray(json, "models")
    .map(toClaudeModel)
    .filter((m): m is ClaudeModel => m !== null)
    .slice(0, LIMITS.claudeModels.max);

  if (models.length < LIMITS.claudeModels.min) {
    throw new Error("有効な Claude モデルが1件もありません");
  }

  return { models, note: str(asRecord(json)?.note) };
}

function toTrendingModel(raw: unknown): TrendingModel | null {
  const r = asRecord(raw);
  if (!r) return null;

  const name = str(r.name);
  const provider = str(r.provider);
  const releaseDate = str(r.releaseDate);
  const summary = str(r.summary);
  if (!name || !provider || !releaseDate || !summary) return null;
  if (/claude/i.test(name)) return null;

  const highlights = strList(r.highlights, LIMITS.highlights.max);
  if (highlights.length < LIMITS.highlights.min) return null;

  const url = isValidSourceUrl(r.url) ? (r.url as string).trim() : null;
  return { name, provider, releaseDate, summary, highlights, url };
}

/** 話題の AI モデルの応答を検証・正規化する */
export function parseTrendingModels(text: string): TrendingModel[] {
  const models = extractArray(extractJson(text), "models")
    .map(toTrendingModel)
    .filter((m): m is TrendingModel => m !== null)
    .slice(0, LIMITS.trendingModels.max);

  if (models.length < LIMITS.trendingModels.min) {
    throw new Error(
      `有効な話題モデルが ${LIMITS.trendingModels.min} 件未満です（${models.length} 件）`
    );
  }
  return models;
}

function toScore(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw.trim().replace(/[%,\s]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toBenchmark(raw: unknown, candidates: Set<string>): Benchmark | null {
  const r = asRecord(raw);
  if (!r) return null;

  const name = str(r.name);
  const description = str(r.description);
  if (!name || !description) return null;

  const seen = new Set<string>();
  const scores: BenchmarkScore[] = [];
  for (const rawScore of Array.isArray(r.scores) ? r.scores : []) {
    const s = asRecord(rawScore);
    const model = str(s?.model);
    const score = toScore(s?.score);
    if (!model || score === null || !candidates.has(model) || seen.has(model)) continue;
    if (!isValidSourceUrl(s?.sourceUrl)) continue;
    seen.add(model);
    scores.push({ model, score, sourceUrl: (s!.sourceUrl as string).trim() });
  }
  if (scores.length === 0) return null;

  return {
    name,
    description,
    unit: typeof r.unit === "string" ? r.unit.trim() : "",
    higherIsBetter: r.higherIsBetter !== false,
    scores,
  };
}

/**
 * ベンチマークの応答を検証・正規化する。
 * 出典 URL が無効なスコア・候補外モデルのスコアは破棄する（出典なしの数値を表示しないため）。
 */
export function parseBenchmarks(text: string, candidateModels: string[]): Benchmark[] {
  const candidates = new Set(candidateModels);
  const benchmarks = extractArray(extractJson(text), "benchmarks")
    .map((b) => toBenchmark(b, candidates))
    .filter((b): b is Benchmark => b !== null)
    .slice(0, LIMITS.benchmarks.max);

  if (benchmarks.length < LIMITS.benchmarks.min) {
    throw new Error(
      `有効なベンチマークが ${LIMITS.benchmarks.min} 件未満です（${benchmarks.length} 件）`
    );
  }
  return benchmarks;
}

/** ベンチマーク比較の対象モデル名（Claude 優先・重複除去・上限あり） */
export function selectBenchmarkCandidates(
  claudeNames: string[],
  otherNames: string[],
  max: number = LIMITS.candidates
): string[] {
  return [...new Set([...claudeNames, ...otherNames])].slice(0, max);
}
