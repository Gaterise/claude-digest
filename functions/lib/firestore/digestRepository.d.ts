import type { DigestArticle, DigestArticleCreate, DigestCategory } from "../types";
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
export declare function listPublished(options?: ListPublishedOptions): Promise<ListPublishedResult>;
/** ID で公開済みダイジェスト記事を取得する */
export declare function findPublishedById(id: string): Promise<DigestArticle | null>;
/** ダイジェスト記事を新規作成する */
export declare function create(data: DigestArticleCreate): Promise<DigestArticle>;
//# sourceMappingURL=digestRepository.d.ts.map