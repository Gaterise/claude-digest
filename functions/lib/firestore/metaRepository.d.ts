import { Timestamp } from "firebase-admin/firestore";
/** 公式リリースの最終チェック日時を記録する */
export declare function updateLastCheckedAt(): Promise<void>;
/** 公式リリースの最終チェック日時を取得する（未記録なら null） */
export declare function getLastCheckedAt(): Promise<Timestamp | null>;
//# sourceMappingURL=metaRepository.d.ts.map