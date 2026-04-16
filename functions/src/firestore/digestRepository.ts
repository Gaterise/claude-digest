import { getFirestore, Timestamp, Query } from "firebase-admin/firestore";
import type { DigestArticle, DigestArticleCreate, DigestCategory } from "../types";

const COLLECTION = "digest_articles";

function getCollection() {
  return getFirestore().collection(COLLECTION);
}

export interface ListPublishedOptions {
  limit?: number;
  cursor?: string;
  category?: DigestCategory;
  from?: string;
  to?: string;
}

export interface ListPublishedResult {
  items: DigestArticle[];
  total: number;
  nextCursor: string | null;
}

/** 公開済みダイジェスト記事を一覧取得する（カーソルページネーション） */
export async function listPublished(
  options: ListPublishedOptions = {}
): Promise<ListPublishedResult> {
  const { limit = 20, cursor, category, from, to } = options;

  // データ取得クエリ（count() は NOT_FOUND エラーになるため使用しない）
  let query: Query = getCollection().where("status", "==", "published");

  if (category) {
    query = query.where("categories", "array-contains", category);
  }
  if (from) {
    query = query.where(
      "publishedAt",
      ">=",
      Timestamp.fromDate(new Date(from))
    );
  }
  if (to) {
    query = query.where(
      "publishedAt",
      "<=",
      Timestamp.fromDate(new Date(to))
    );
  }

  query = query.orderBy("publishedAt", "desc").limit(limit + 1);

  if (cursor) {
    const cursorDoc = await getCollection().doc(cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snap = await query.get();
  const docs = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as DigestArticle
  );

  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  const total = cursor ? -1 : items.length + (hasMore ? 1 : 0);

  return { items, total, nextCursor };
}

/** ID で公開済みダイジェスト記事を取得する */
export async function findPublishedById(
  id: string
): Promise<DigestArticle | null> {
  const doc = await getCollection().doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Omit<DigestArticle, "id">;
  if (data.status !== "published") return null;
  return { id: doc.id, ...data };
}

/** ダイジェスト記事を新規作成する */
export async function create(
  data: DigestArticleCreate
): Promise<DigestArticle> {
  const now = Timestamp.now();
  const docData = {
    ...data,
    createdAt: data.createdAt ?? now,
    updatedAt: now,
  };
  const ref = await getCollection().add(docData);
  return { id: ref.id, ...docData } as DigestArticle;
}
