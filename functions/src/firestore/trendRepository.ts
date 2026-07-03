import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { AiTrends, TrendItem } from "../types";

const COLLECTION = "meta";
const AI_TRENDS_DOC = "ai_trends";

function getDocRef() {
  return getFirestore().collection(COLLECTION).doc(AI_TRENDS_DOC);
}

/** 生成した AI トレンドを保存する（全件置き換え） */
export async function saveTrends(items: TrendItem[]): Promise<void> {
  await getDocRef().set({ items, generatedAt: Timestamp.now() });
}

/** 最新の AI トレンドを取得する（未生成なら null） */
export async function getTrends(): Promise<AiTrends | null> {
  const doc = await getDocRef().get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (!data?.items || !data?.generatedAt) return null;
  return {
    items: data.items as TrendItem[],
    generatedAt: data.generatedAt as Timestamp,
  };
}
