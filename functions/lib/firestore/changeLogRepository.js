"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByContentHash = findByContentHash;
exports.findByTagName = findByTagName;
exports.create = create;
exports.updateStatus = updateStatus;
exports.findPending = findPending;
exports.findById = findById;
const firestore_1 = require("firebase-admin/firestore");
const COLLECTION = "change_logs";
function getCollection() {
    return (0, firestore_1.getFirestore)().collection(COLLECTION);
}
/** contentHash で既存ドキュメントを検索（重複チェック FR-010） */
async function findByContentHash(contentHash) {
    const snap = await getCollection()
        .where("contentHash", "==", contentHash)
        .limit(1)
        .get();
    if (snap.empty)
        return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
}
/** tagName で既存ドキュメントを検索 */
async function findByTagName(tagName) {
    const snap = await getCollection()
        .where("tagName", "==", tagName)
        .limit(1)
        .get();
    if (snap.empty)
        return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
}
/** ChangeLog を新規作成する。contentHash が重複する場合は null を返す */
async function create(data) {
    const existing = await findByContentHash(data.contentHash);
    if (existing)
        return null;
    const ref = await getCollection().add({
        ...data,
        fetchedAt: data.fetchedAt ?? firestore_1.Timestamp.now(),
    });
    return { id: ref.id, ...data };
}
/** ステータスを更新する */
async function updateStatus(id, status, errorMessage) {
    await getCollection()
        .doc(id)
        .update({ status, errorMessage: errorMessage ?? null });
}
/** pending ステータスの ChangeLog を古い順に取得する */
async function findPending(limit = 10) {
    const snap = await getCollection()
        .where("status", "==", "pending")
        .orderBy("fetchedAt", "asc")
        .limit(limit)
        .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
/** ID で取得する */
async function findById(id) {
    const doc = await getCollection().doc(id).get();
    if (!doc.exists)
        return null;
    return { id: doc.id, ...doc.data() };
}
//# sourceMappingURL=changeLogRepository.js.map