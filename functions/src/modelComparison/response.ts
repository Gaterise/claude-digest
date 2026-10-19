import type { ModelComparisonData } from "../types";

export interface ModelComparisonResponse {
  claudeModels: ModelComparisonData["claudeModels"];
  claudeNote: string | null;
  benchmarks: ModelComparisonData["benchmarks"];
  trendingModels: ModelComparisonData["trendingModels"];
  updatedAt: {
    claudeModels: string | null;
    benchmarks: string | null;
    trendingModels: string | null;
  };
}

const toIso = (date: Date | null): string | null => (date ? date.toISOString() : null);

/** Firestore のスナップショットを GET /model-comparison のレスポンスに変換する */
export function toModelComparisonResponse(
  data: ModelComparisonData | null
): ModelComparisonResponse {
  return {
    claudeModels: data?.claudeModels ?? [],
    claudeNote: data?.claudeNote ?? null,
    benchmarks: data?.benchmarks ?? [],
    trendingModels: data?.trendingModels ?? [],
    updatedAt: {
      claudeModels: toIso(data?.claudeModelsUpdatedAt ?? null),
      benchmarks: toIso(data?.benchmarksUpdatedAt ?? null),
      trendingModels: toIso(data?.trendingModelsUpdatedAt ?? null),
    },
  };
}
