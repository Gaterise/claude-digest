import { Router, type Request, type Response } from "express";
import { getMessaging } from "firebase-admin/messaging";
import { CHANGELOG_TOPIC } from "../../notifications/notificationSender";

const router = Router();

/** リクエストボディから FCM 登録トークンを取り出す。不正なら null */
function extractToken(req: Request): string | null {
  const { token } = req.body as { token?: unknown };
  if (typeof token !== "string") return null;
  const trimmed = token.trim();
  // FCM 登録トークンは通常 150〜300 文字程度。明らかな不正値を弾く
  if (trimmed.length < 20 || trimmed.length > 4096) return null;
  return trimmed;
}

/** プッシュ通知の購読を登録する */
router.post("/subscribe", async (req: Request, res: Response): Promise<void> => {
  const token = extractToken(req);
  if (!token) {
    res.status(400).json({ error: "登録トークンが不正です" });
    return;
  }

  try {
    const result = await getMessaging().subscribeToTopic(token, CHANGELOG_TOPIC);
    if (result.failureCount > 0) {
      console.error("トピック購読失敗:", result.errors[0]?.error);
      res.status(400).json({ error: "登録トークンが無効です" });
      return;
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("トピック購読例外:", err);
    res.status(500).json({ error: "通知の登録中にエラーが発生しました" });
  }
});

/** プッシュ通知の購読を解除する */
router.post("/unsubscribe", async (req: Request, res: Response): Promise<void> => {
  const token = extractToken(req);
  if (!token) {
    res.status(400).json({ error: "登録トークンが不正です" });
    return;
  }

  try {
    await getMessaging().unsubscribeFromTopic(token, CHANGELOG_TOPIC);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("トピック購読解除例外:", err);
    res.status(500).json({ error: "通知の解除中にエラーが発生しました" });
  }
});

export default router;