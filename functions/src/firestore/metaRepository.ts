import { getFirestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "meta";
const SCRAPE_STATUS_DOC = "scrape_status";

function getDocRef() {
  return getFirestore().collection(COLLECTION).doc(SCRAPE_STATUS_DOC);
}

/** 公式リリースの最終チェック日時を記録する */
export async function updateLastCheckedAt(): Promise<void> {
  await getDocRef().set({ lastCheckedAt: Timestamp.now() }, { merge: true });
}

/** 公式リリースの最終チェック日時を取得する（未記録なら null） */
export async function getLastCheckedAt(): Promise<Timestamp | null> {
  const doc = await getDocRef().get();
  if (!doc.exists) return null;
  return (doc.data()?.lastCheckedAt as Timestamp) ?? null;
}