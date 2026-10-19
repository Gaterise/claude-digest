import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { ModelComparisonData } from "../types";

const COLLECTION = "meta";
const MODEL_COMPARISON_DOC = "model_comparison";

function getDocRef() {
  return getFirestore().collection(COLLECTION).doc(MODEL_COMPARISON_DOC);
}

const toTimestamp = (date: Date | null): Timestamp | null =>
  date ? Timestamp.fromDate(date) : null;

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null;

/** 最新のモデル比較データを保存する（全置換） */
export async function saveModelComparison(data: ModelComparisonData): Promise<void> {
  await getDocRef().set({
    ...data,
    claudeModelsUpdatedAt: toTimestamp(data.claudeModelsUpdatedAt),
    benchmarksUpdatedAt: toTimestamp(data.benchmarksUpdatedAt),
    trendingModelsUpdatedAt: toTimestamp(data.trendingModelsUpdatedAt),
  });
}

/** 最新のモデル比較データを取得する（未生成なら null） */
export async function getModelComparison(): Promise<ModelComparisonData | null> {
  const doc = await getDocRef().get();
  if (!doc.exists) return null;
  const d = doc.data() ?? {};
  return {
    claudeModels: Array.isArray(d.claudeModels) ? d.claudeModels : [],
    claudeNote: typeof d.claudeNote === "string" ? d.claudeNote : null,
    claudeModelsUpdatedAt: toDate(d.claudeModelsUpdatedAt),
    benchmarks: Array.isArray(d.benchmarks) ? d.benchmarks : [],
    benchmarksUpdatedAt: toDate(d.benchmarksUpdatedAt),
    trendingModels: Array.isArray(d.trendingModels) ? d.trendingModels : [],
    trendingModelsUpdatedAt: toDate(d.trendingModelsUpdatedAt),
  };
}
