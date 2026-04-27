import { Router, type Request, type Response } from "express";

const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_SERVICE_ID = "service_ltvcosr";
const EMAILJS_TEMPLATE_ID = "template_y6rg0jm";
const EMAILJS_PUBLIC_KEY = "02XyvyLs9BGXTc5as";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, body } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    body?: string;
  };

  // バリデーション
  if (!subject?.trim() || !body?.trim()) {
    res.status(400).json({ error: "件名とお問い合わせ内容は必須です" });
    return;
  }

  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();
  if (!privateKey) {
    console.error("EMAILJS_PRIVATE_KEY が設定されていません");
    res.status(500).json({ error: "サーバー設定エラーが発生しました" });
    return;
  }

  try {
    const response = await fetch(EMAILJS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: privateKey,
        template_params: {
          from_name: name?.trim() || "（未入力）",
          from_email: email?.trim() || "（未入力）",
          subject: subject.trim(),
          message: body.trim(),
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`EmailJS エラー: HTTP ${response.status}`, text);
      res.status(502).json({ error: "メール送信に失敗しました" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("メール送信例外:", err);
    res.status(500).json({ error: "メール送信中にエラーが発生しました" });
  }
});

export default router;
