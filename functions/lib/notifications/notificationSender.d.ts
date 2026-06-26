import type { DigestArticle } from "../types";
/** 変更ログ更新通知の購読者が登録される FCM トピック名 */
export declare const CHANGELOG_TOPIC = "changelog-updates";
/**
 * 新規ダイジェスト記事の公開をトピック購読者全員にプッシュ通知する。
 * 通知失敗で記事処理を巻き戻さないため、エラーはログ出力のみで握りつぶす。
 */
export declare function sendNewDigestNotification(article: Pick<DigestArticle, "id" | "title">): Promise<void>;
//# sourceMappingURL=notificationSender.d.ts.map