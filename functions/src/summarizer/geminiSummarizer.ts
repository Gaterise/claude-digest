import { VertexAI } from "@google-cloud/vertexai";
import type { DigestCategory } from "../types";

export interface SummarizationResult {
  title: string;
  summary: string;
  keyPoints: string[];
  categories: DigestCategory[];
}

const SYSTEM_PROMPT = `あなたはClaude（Anthropic）の変更ログを日本語で要約する専門家です。
以下のルールに従って要約してください：

1. title: 日本語で簡潔かつ魅力的なタイトル（255文字以内）
2. summary: 日本語Markdown形式の要約本文（500〜2000文字）。## で見出しをつけ、箇条書きを活用
3. keyPoints: 重要なポイントを3〜7件の箇条書き配列
4. categories: 以下から該当する分類を1つ以上選択
   - new_feature（新機能）
   - improvement（改善）
   - bug_fix（バグ修正）
   - deprecation（非推奨）
   - breaking_change（破壊的変更）
   - other（その他）

必ず以下のJSON形式のみで出力してください。前置きや説明は不要です。
{"title":"...","summary":"...","keyPoints":["..."],"categories":["..."]}`;

/** HTMLタグを除去してプレーンテキストに変換する */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * @google-cloud/vertexai SDK で Gemini を呼び出し、変更ログを日本語ダイジェストに要約する。
 * Cloud Run / Cloud Functions 上では Application Default Credentials (ADC) が自動適用される。
 * 事前に Vertex AI API (aiplatform.googleapis.com) の有効化と、実行サービスアカウントへの
 * roles/aiplatform.user 付与が必要。
 */
export async function summarizeChangeLog(
  rawContent: string,
  originalTitle: string
): Promise<SummarizationResult> {
  const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    throw new Error("GCLOUD_PROJECT が取得できません");
  }

  const vertexAI = new VertexAI({
    project: projectId,
    location: "asia-northeast1",
  });

  const model = vertexAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.2,
    },
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_PROMPT }],
    },
  });

  const plainContent = stripHtml(rawContent);
  const prompt = `以下の変更ログを日本語で要約してください。\n\nタイトル: ${originalTitle}\n\n内容:\n${plainContent}`;

  const result = await model.generateContent(prompt);
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini から応答テキストが返りませんでした");
  }

  // ```json ... ``` コードブロックを先に除去してからJSONを抽出
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/) ?? text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Gemini の応答から JSON を抽出できませんでした: ${text.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as SummarizationResult;

  // バリデーション
  if (!parsed.title || parsed.title.length > 255) {
    throw new Error("title が不正です");
  }
  if (!parsed.summary) {
    throw new Error("summary が空です");
  }
  if (!Array.isArray(parsed.keyPoints) || parsed.keyPoints.length < 1) {
    throw new Error("keyPoints は1件以上必要です");
  }
  if (parsed.keyPoints.length > 7) {
    parsed.keyPoints = parsed.keyPoints.slice(0, 7);
  }
  if (!Array.isArray(parsed.categories) || parsed.categories.length < 1) {
    throw new Error("categories は1件以上必要です");
  }

  const validCategories: DigestCategory[] = [
    "new_feature",
    "improvement",
    "bug_fix",
    "deprecation",
    "breaking_change",
    "other",
  ];
  parsed.categories = parsed.categories.filter((c) =>
    validCategories.includes(c)
  );
  if (parsed.categories.length === 0) {
    parsed.categories = ["other"];
  }

  return parsed;
}
