import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { ChangeLog, ChangeLogCreate } from "../types";

const COLLECTION = "change_logs";

function getCollection() {
  return getFirestore().collection(COLLECTION);
}

/**
 * tagName をドキュメント ID として使用。
 * .where() クエリを一切使わないことで NOT_FOUND エラーを回避する。
 */

/** tagName（= ドキュメントID）で取得 */
export async function findByTagName(
  tagName: string
): Promise<ChangeLog | null> {
  const doc = await getCollection().doc(tagName).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as ChangeLog;
}

/**
 * ChangeLog を新規作成する。
 * tagName をドキュメント ID として使い、getDoc で重複チェックする。
 * 既存の場合は null を返す。
 */
export async function create(
  data: ChangeLogCreate
): Promise<ChangeLog | null> {
  const docId = data.tagName;
  const ref = getCollection().doc(docId);
  const existing = await ref.get();
  if (existing.exists) return null;

  const docData = {
    ...data,
    fetchedAt: data.fetchedAt ?? Timestamp.now(),
  };
  await ref.set(docData);
  return { id: docId, ...docData } as ChangeLog;
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

/** ID で取得する */
export async function findById(id: string): Promise<ChangeLog | null> {
  const doc = await getCollection().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as ChangeLog;
}

/** 指定ステータスの ChangeLog を最大 limit 件取得する */
export async function findByStatus(
  status: ChangeLog["status"],
  limit = 200
): Promise<ChangeLog[]> {
  const snap = await getCollection()
    .where("status", "==", status)
    .limit(limit)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ChangeLog);
}

