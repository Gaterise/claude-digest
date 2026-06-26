import { getMessaging } from "firebase-admin/messaging";
import { logger } from "firebase-functions";
import type { DigestArticle } from "../types";

/** 変更ログ更新通知の購読者が登録される FCM トピック名 */
export const CHANGELOG_TOPIC = "changelog-updates";

const SITE_URL = "https://claude-digest.com";

/**
 * 新規ダイジェスト記事の公開をトピック購読者全員にプッシュ通知する。
 * 通知失敗で記事処理を巻き戻さないため、エラーはログ出力のみで握りつぶす。
 */
export async function sendNewDigestNotification(
  article: Pick<DigestArticle, "id" | "title">
): Promise<void> {
  try {
    const messageId = await getMessaging().send({
      topic: CHANGELOG_TOPIC,
      notification: {
        title: "Claude の変更ログが更新されました",
        body: article.title,
      },
      webpush: {
        notification: {
          icon: `${SITE_URL}/icon-192x192.png`,
        },
        fcmOptions: {
          link: `${SITE_URL}/digests/${article.id}`,
        },
      },
    });
    logger.info(`プッシュ通知送信完了: ${messageId} (記事 ${article.id})`);
  } catch (error) {
    logger.error(`プッシュ通知送信エラー (記事 ${article.id}):`, error);
  }
}