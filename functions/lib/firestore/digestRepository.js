"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPublished = listPublished;
exports.findPublishedById = findPublishedById;
exports.create = create;
const firestore_1 = require("firebase-admin/firestore");
const COLLECTION = "digest_articles";
function getCollection() {
    return (0, firestore_1.getFirestore)().collection(COLLECTION);
}
/** 公開済みダイジェスト記事を一覧取得する（カーソルページネーション） */
async function listPublished(options = {}) {
    const { limit = 20, cursor, category, from, to } = options;
    // データ取得クエリ（count() は NOT_FOUND エラーになるため使用しない）
    let query = getCollection().where("status", "==", "published");
    if (category) {
        query = query.where("categories", "array-contains", category);
    }
    if (from) {
        query = query.where("publishedAt", ">=", firestore_1.Timestamp.fromDate(new Date(from)));
    }
    if (to) {
        query = query.where("publishedAt", "<=", firestore_1.Timestamp.fromDate(new Date(to)));
    }
    query = query.orderBy("publishedAt", "desc").limit(limit + 1);
    if (cursor) {
        const cursorDoc = await getCollection().doc(cursor).get();
        if (cursorDoc.exists) {
            query = query.startAfter(cursorDoc);
        }
    }
    const snap = await query.get();
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? items[items.length - 1].id : null;
    const total = cursor ? -1 : items.length + (hasMore ? 1 : 0);
    return { items, total, nextCursor };
}
/** ID で公開済みダイジェスト記事を取得する */
async function findPublishedById(id) {
    const doc = await getCollection().doc(id).get();
    if (!doc.exists)
        return null;
    const data = doc.data();
    if (data.status !== "published")
        return null;
    return { id: doc.id, ...data };
}
/** ダイジェスト記事を新規作成する */
async function create(data) {
    const now = firestore_1.Timestamp.now();
    const docData = {
        ...data,
        createdAt: data.createdAt ?? now,
        updatedAt: now,
    };
    const ref = await getCollection().add(docData);
    return { id: ref.id, ...docData };
}
//# sourceMappingURL=digestRepository.js.map