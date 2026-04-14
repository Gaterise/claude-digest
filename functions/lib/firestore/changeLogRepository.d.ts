import type { ChangeLog, ChangeLogCreate } from "../types";
/** contentHash で既存ドキュメントを検索（重複チェック FR-010） */
export declare function findByContentHash(contentHash: string): Promise<ChangeLog | null>;
/** tagName で既存ドキュメントを検索 */
export declare function findByTagName(tagName: string): Promise<ChangeLog | null>;
/** ChangeLog を新規作成する。contentHash が重複する場合は null を返す */
export declare function create(data: ChangeLogCreate): Promise<ChangeLog | null>;
/** ステータスを更新する */
export declare function updateStatus(id: string, status: ChangeLog["status"], errorMessage?: string | null): Promise<void>;
/** pending ステータスの ChangeLog を古い順に取得する */
export declare function findPending(limit?: number): Promise<ChangeLog[]>;
/** ID で取得する */
export declare function findById(id: string): Promise<ChangeLog | null>;
//# sourceMappingURL=changeLogRepository.d.ts.map