import type { Benchmark, ClaudeModel, ModelComparisonData, TrendingModel } from "../types";
import { selectBenchmarkCandidates } from "./parser";

export type ModelComparisonSection = "claudeModels" | "trendingModels" | "benchmarks";

export interface ModelComparisonGenerators {
  generateClaudeModels(): Promise<{ models: ClaudeModel[]; note: string | null }>;
  generateTrendingModels(): Promise<TrendingModel[]>;
  generateBenchmarks(candidateModels: string[]): Promise<Benchmark[]>;
}

export interface UpdateResult {
  /** 保存すべきスナップショット。全区分が失敗した場合は null（書き込みしない） */
  data: ModelComparisonData | null;
  errors: { section: ModelComparisonSection; message: string }[];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * 3区分（Claude モデル → 話題モデル → ベンチマーク）を順に生成し、
 * 区分単位で「成功なら置換・失敗なら前回データ維持」でマージする。
 */
export async function updateModelComparison({
  previous,
  generators,
  now,
}: {
  previous: ModelComparisonData | null;
  generators: ModelComparisonGenerators;
  now: Date;
}): Promise<UpdateResult> {
  const errors: UpdateResult["errors"] = [];
  const data: ModelComparisonData = {
    claudeModels: previous?.claudeModels ?? [],
    claudeNote: previous?.claudeNote ?? null,
    claudeModelsUpdatedAt: previous?.claudeModelsUpdatedAt ?? null,
    benchmarks: previous?.benchmarks ?? [],
    benchmarksUpdatedAt: previous?.benchmarksUpdatedAt ?? null,
    trendingModels: previous?.trendingModels ?? [],
    trendingModelsUpdatedAt: previous?.trendingModelsUpdatedAt ?? null,
  };
  let successCount = 0;

  try {
    const claude = await generators.generateClaudeModels();
    data.claudeModels = claude.models;
    data.claudeNote = claude.note;
    data.claudeModelsUpdatedAt = now;
    successCount++;
  } catch (error) {
    errors.push({ section: "claudeModels", message: errorMessage(error) });
  }

  try {
    data.trendingModels = await generators.generateTrendingModels();
    data.trendingModelsUpdatedAt = now;
    successCount++;
  } catch (error) {
    errors.push({ section: "trendingModels", message: errorMessage(error) });
  }

  const claudeNames = data.claudeModels.map((m) => m.name);
  if (claudeNames.length === 0) {
    errors.push({
      section: "benchmarks",
      message: "比較対象の Claude モデルがないためベンチマーク生成をスキップしました",
    });
  } else {
    try {
      const candidates = selectBenchmarkCandidates(
        claudeNames,
        data.trendingModels.map((m) => m.name)
      );
      data.benchmarks = await generators.generateBenchmarks(candidates);
      data.benchmarksUpdatedAt = now;
      successCount++;
    } catch (error) {
      errors.push({ section: "benchmarks", message: errorMessage(error) });
    }
  }

  return { data: successCount > 0 ? data : null, errors };
}
