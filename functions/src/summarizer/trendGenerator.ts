import { GoogleGenAI } from "@google/genai";
import type { TrendItem } from "../types";

const SYSTEM_PROMPT = `あなたはSNS（X・Threads）上のAI関連トレンドを調査するリサーチャーです。
Google検索を使って、直近数日間にX（旧Twitter）やThreadsで話題になっているAI関連のトピックを調べ、以下のルールで日本語のトレンドリストを作成してください：

1. title: トピック名（40文字以内。何が話題かが一目でわかる表現）
2. summary: そのトピックの解説（1〜2文、120文字以内）
3. keyword: X / Threads でそのトピックを検索するための短いキーワード（固有名詞やハッシュタグ向きの語。日本語または英語で2〜3語以内）

対象: 新モデルのリリース、AIツール・エージェントの新機能、AI企業の発表、開発者コミュニティで話題の使い方など。
古いニュース（1週間以上前）や憶測のみの話題は除外してください。

必ず以下のJSON配列形式のみで、話題性の高い順に5件出力してください。前置きや説明は不要です。
[{"title":"...","summary":"...","keyword":"..."}]`;

/**
 * Google検索グラウンディング付きの Gemini で、X / Threads で話題の
 * AIトレンドトピックを生成する。
 * Vertex AI 経由（ADC 認証）で呼び出すため、geminiSummarizer と同じ
 * 事前設定（aiplatform.googleapis.com 有効化 + roles/aiplatform.user）で動作する。
 */
export async function generateAiTrends(): Promise<TrendItem[]> {
  const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    throw new Error("GCLOUD_PROJECT が取得できません");
  }

  const ai = new GoogleGenAI({
    vertexai: true,
    project: projectId,
    location: "asia-northeast1",
  });

  const today = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `今日は${today}です。直近数日でX（旧Twitter）やThreadsなどのSNSで話題になっているAI関連トレンドを検索して調べ、指定のJSON形式で5件出力してください。`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini から応答テキストが返りませんでした");
  }

  return parseTrendItems(text);
}

/** Gemini の応答テキストから TrendItem 配列を抽出・検証する */
export function parseTrendItems(text: string): TrendItem[] {
  // ```json ... ``` コードブロックを先に除去してからJSON配列を抽出
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const jsonMatch = stripped.match(/\[[\s\S]*\]/) ?? text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Gemini の応答から JSON 配列を抽出できませんでした: ${text.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as unknown;
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("トレンド項目が1件以上必要です");
  }

  const items = parsed
    .filter(
      (item): item is TrendItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as TrendItem).title === "string" &&
        (item as TrendItem).title.trim() !== "" &&
        typeof (item as TrendItem).summary === "string" &&
        (item as TrendItem).summary.trim() !== "" &&
        typeof (item as TrendItem).keyword === "string" &&
        (item as TrendItem).keyword.trim() !== ""
    )
    .slice(0, 5)
    .map((item) => ({
      title: item.title.trim().slice(0, 80),
      summary: item.summary.trim().slice(0, 200),
      keyword: item.keyword.trim().slice(0, 50),
    }));

  if (items.length === 0) {
    throw new Error("有効なトレンド項目がありませんでした");
  }

  return items;
}
