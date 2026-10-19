import { GoogleGenAI } from "@google/genai";
import { logger } from "firebase-functions";
import type { Benchmark, ClaudeModel, TrendingModel } from "../types";
import { parseBenchmarks, parseClaudeModels, parseTrendingModels } from "./parser";
import { fetchRedirectLocation, resolveGroundingRedirects } from "./sourceResolver";
import type { ModelComparisonGenerators } from "./updater";

const MODEL = "gemini-2.5-flash";
const MAX_ATTEMPTS = 3;

const COMMON_RULES = `- Google検索で最新の一次情報（公式サイト・公式ブログ・公式ドキュメント・著名なリーダーボード）を確認すること
- 推測や噂、未確認の情報は含めないこと
- 文章はすべて自然な日本語で書くこと（モデル名・モデルID・ベンチマーク名などの固有名詞は原文のまま）
- 必ず指定された JSON のみを出力すること。前置き・説明・コードブロック記法は不要`;

const CLAUDE_PROMPT = `あなたは Anthropic の Claude モデルに詳しいテクニカルライターです。
Anthropic が現在一般提供している Claude の最新モデルを、ファミリー（例: Opus / Sonnet / Haiku など）ごとに最新の1モデルずつ、性能の高い順に調べてください。

ルール:
${COMMON_RULES}
- modelId は API で指定する正式なモデルID（例: "claude-opus-4-8"）
- context / maxOutput は「100万トークン」「6.4万トークン」のような日本語表記
- priceInput / priceOutput は API の100万トークンあたりの米ドル価格（例: "$5.00"）
- tagline は位置づけを10文字以内で（例: "最上位モデル"、"バランス型"、"高速・低コスト"）
- description は特徴を2〜3文で
- strengths は得意なことを3〜4件
- guideTitle は使い分けの一言見出し（例: "迷ったら Sonnet。"）、guideText はその補足1〜2文
- note には旧バージョンのモデルや限定提供モデルなど、補足すべき事項を1〜2文で（なければ null）

出力形式:
{"models":[{"family":"...","name":"...","modelId":"...","tagline":"...","context":"...","maxOutput":"...","priceInput":"...","priceOutput":"...","description":"...","strengths":["..."],"guideTitle":"...","guideText":"..."}],"note":"..."}`;

const TRENDING_PROMPT = `あなたは生成 AI 業界の動向を追うリサーチャーです。
直近1〜2か月で話題になっている、Anthropic（Claude）以外の AI モデルを5件、話題性の高い順に調べてください。
ベンダーは問いません（大規模言語モデル、マルチモーダルモデル、オープンウェイトモデルなど）。

ルール:
${COMMON_RULES}
- name は正式なモデル名（例: "GPT-5.5"）。Claude のモデルは含めないこと
- provider は提供元の企業・組織名
- releaseDate は発表・リリース時期（例: "2026年9月"）
- summary はどんなモデルかを1〜2文で
- highlights は注目ポイントを2〜3件
- url は公式の発表ページまたは製品ページの URL

出力形式:
[{"name":"...","provider":"...","releaseDate":"...","summary":"...","highlights":["..."],"url":"https://..."}]`;

function benchmarkPrompt(candidates: string[]): string {
  return `あなたは AI モデルのベンチマークを分析するアナリストです。
現在、最先端 AI モデルの比較で注目されている主要ベンチマークを5〜6件選び、下記の候補モデルの公表スコアを調べてください。

候補モデル（model にはこの表記をそのまま使うこと）:
${candidates.map((c) => `- ${c}`).join("\n")}

ルール:
${COMMON_RULES}
- コーディング・推論・知識・エージェント・マルチモーダルなど、分野が偏らないように選ぶこと
- description はそのベンチマークが何を測るかを1文で
- unit はスコアの単位（"%" や "Elo" など。単位がなければ空文字）
- higherIsBetter は数値が高いほど良い場合 true
- scores には、公式発表または著名なリーダーボードで確認できたスコアのみを含めること
- 各スコアの sourceUrl には、その数値を確認できる公式ページまたはリーダーボードの URL を必ず記載すること
- 確認できなかったモデルのスコアは推測で埋めず、scores に含めないこと

出力形式:
[{"name":"...","description":"...","unit":"%","higherIsBetter":true,"scores":[{"model":"...","score":0,"sourceUrl":"https://..."}]}]`;
}

function createClient(): GoogleGenAI {
  const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    throw new Error("GCLOUD_PROJECT が取得できません");
  }
  return new GoogleGenAI({ vertexai: true, project: projectId, location: "asia-northeast1" });
}

function todayJst(): string {
  return new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 検索グラウンディング付き Gemini を呼び出し、parse に成功するまで最大 MAX_ATTEMPTS 回試行する */
async function generateWithRetry<T>(
  ai: GoogleGenAI,
  label: string,
  systemInstruction: string,
  parse: (text: string) => T
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `今日は${todayJst()}です。指示に従って最新情報を検索し、指定の JSON 形式で出力してください。`,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
          maxOutputTokens: 16384,
        },
      });
      const raw = response.text;
      if (!raw) {
        throw new Error("Gemini から応答テキストが返りませんでした");
      }
      const { text, resolved, failed } = await resolveGroundingRedirects(raw, (url) =>
        fetchRedirectLocation(url)
      );
      if (resolved + failed > 0) {
        logger.info(`${label}: 出典 URL を解決 ${resolved} 件 / 失敗 ${failed} 件`);
      }
      return parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        logger.warn(`${label} の生成 ${attempt} 回目失敗、リトライします:`, error);
      }
    }
  }
  throw lastError;
}

/** Vertex AI（ADC 認証）経由の Gemini を使う本番用ジェネレーター */
export function createGeminiGenerators(): ModelComparisonGenerators {
  const ai = createClient();
  return {
    generateClaudeModels: (): Promise<{ models: ClaudeModel[]; note: string | null }> =>
      generateWithRetry(ai, "Claude モデル", CLAUDE_PROMPT, parseClaudeModels),
    generateTrendingModels: (): Promise<TrendingModel[]> =>
      generateWithRetry(ai, "話題の AI モデル", TRENDING_PROMPT, parseTrendingModels),
    generateBenchmarks: (candidates: string[]): Promise<Benchmark[]> =>
      generateWithRetry(ai, "ベンチマーク", benchmarkPrompt(candidates), (text) =>
        parseBenchmarks(text, candidates)
      ),
  };
}
