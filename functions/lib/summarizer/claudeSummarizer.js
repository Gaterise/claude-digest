"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeChangeLog = summarizeChangeLog;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
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

JSON形式で出力してください。`;
/** HTMLタグを除去してプレーンテキストに変換する */
function stripHtml(html) {
    return html
        .replace(/<[^>]+>/g, " ") // タグを空白に置換
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s{2,}/g, " ") // 連続空白を1つに
        .trim();
}
/** 変更ログの生コンテンツを日本語ダイジェストに要約する */
async function summarizeChangeLog(rawContent, originalTitle) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY が設定されていません");
    }
    const client = new sdk_1.default({ apiKey });
    // HTMLタグを除去してプレーンテキスト化
    const plainContent = stripHtml(rawContent);
    const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
            {
                role: "user",
                content: `以下の変更ログを日本語で要約してください。\n\nタイトル: ${originalTitle}\n\n内容:\n${plainContent}`,
            },
        ],
    });
    // レスポンスからテキストを抽出
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
        throw new Error("Anthropic API からテキストレスポンスが返りませんでした");
    }
    // JSON をパース
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Anthropic API のレスポンスから JSON を抽出できませんでした");
    }
    const parsed = JSON.parse(jsonMatch[0]);
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
    const validCategories = [
        "new_feature",
        "improvement",
        "bug_fix",
        "deprecation",
        "breaking_change",
        "other",
    ];
    parsed.categories = parsed.categories.filter((c) => validCategories.includes(c));
    if (parsed.categories.length === 0) {
        parsed.categories = ["other"];
    }
    return parsed;
}
//# sourceMappingURL=claudeSummarizer.js.map