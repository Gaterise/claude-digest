import type { ChangeLog, ChangeLogCreate } from "../types";
/**
 * tagName をドキュメント ID として使用。
 * .where() クエリを一切使わないことで NOT_FOUND エラーを回避する。
 */
/** tagName（= ドキュメントID）で取得 */
export declare function findByTagName(tagName: string): Promise<ChangeLog | null>;
/**
 * ChangeLog を新規作成する。
 * tagName をドキュメント ID として使い、getDoc で重複チェックする。
 * 既存の場合は null を返す。
 */
export declare function create(data: ChangeLogCreate): Promise<ChangeLog | null>;
/** ステータスを更新する */
export declare function updateStatus(id: string, status: ChangeLog["status"], errorMessage?: string | null): Promise<void>;
/** ID で取得する */
export declare function findById(id: string): Promise<ChangeLog | null>;
/** 指定ステータスの ChangeLog を最大 limit 件取得する */
export declare function findByStatus(status: ChangeLog["status"], limit?: number): Promise<ChangeLog[]>;
//# sourceMappingURL=changeLogRepository.d.ts.map