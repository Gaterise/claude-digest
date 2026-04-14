import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { ChangeLog, ChangeLogCreate } from "../types";

const COLLECTION = "change_logs";

function getCollection() {
  return getFirestore().collection(COLLECTION);
}

/** contentHash で既存ドキュメントを検索（重複チェック FR-010） */
export async function findByContentHash(
  contentHash: string
): Promise<ChangeLog | null> {
  const snap = await getCollection()
    .where("contentHash", "==", contentHash)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as ChangeLog;
}

/** ChangeLog を新規作成する。重複の場合は null を返す */
export async function create(
  data: ChangeLogCreate
): Promise<ChangeLog | null> {
  const existing = await findByContentHash(data.contentHash);
  if (existing) return null;

  const ref = await getCollection().add({
    ...data,
    fetchedAt: data.fetchedAt ?? Timestamp.now(),
  });
  return { id: ref.id, ...data } as ChangeLog;
}

/** ステータスを更新する */
export async function updateStatus(
  id: string,
  status: ChangeLog["status"],
  errorMessage?: string | null
): Promise<void> {
  await getCollection()
    .doc(id)
    .update({ status, errorMessage: errorMessage ?? null });
}

/** pending ステータスの ChangeLog を古い順に取得する */
export async function findPending(limit = 10): Promise<ChangeLog[]> {
  const snap = await getCollection()
    .where("status", "==", "pending")
    .orderBy("fetchedAt", "asc")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ChangeLog);
}

/** ID で取得する */
export async function findById(id: string): Promise<ChangeLog | null> {
  const doc = await getCollection().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as ChangeLog;
}
