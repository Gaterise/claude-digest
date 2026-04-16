"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByTagName = findByTagName;
exports.create = create;
exports.updateStatus = updateStatus;
exports.findById = findById;
exports.findByStatus = findByStatus;
const firestore_1 = require("firebase-admin/firestore");
const COLLECTION = "change_logs";
function getCollection() {
    return (0, firestore_1.getFirestore)().collection(COLLECTION);
}
/**
 * tagName をドキュメント ID として使用。
 * .where() クエリを一切使わないことで NOT_FOUND エラーを回避する。
 */
/** tagName（= ドキュメントID）で取得 */
async function findByTagName(tagName) {
    const doc = await getCollection().doc(tagName).get();
    if (!doc.exists)
        return null;
    return { id: doc.id, ...doc.data() };
}
/**
 * ChangeLog を新規作成する。
 * tagName をドキュメント ID として使い、getDoc で重複チェックする。
 * 既存の場合は null を返す。
 */
async function create(data) {
    const docId = data.tagName;
    const ref = getCollection().doc(docId);
    const existing = await ref.get();
    if (existing.exists)
        return null;
    const docData = {
        ...data,
        fetchedAt: data.fetchedAt ?? firestore_1.Timestamp.now(),
    };
    await ref.set(docData);
    return { id: docId, ...docData };
}
/** ステータスを更新する */
async function updateStatus(id, status, errorMessage) {
    await getCollection()
        .doc(id)
        .update({ status, errorMessage: errorMessage ?? null });
}
/** ID で取得する */
async function findById(id) {
    const doc = await getCollection().doc(id).get();
    if (!doc.exists)
        return null;
    return { id: doc.id, ...doc.data() };
}
/** 指定ステータスの ChangeLog を最大 limit 件取得する */
async function findByStatus(status, limit = 200) {
    const snap = await getCollection()
        .where("status", "==", status)
        .limit(limit)
        .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
//# sourceMappingURL=changeLogRepository.js.map