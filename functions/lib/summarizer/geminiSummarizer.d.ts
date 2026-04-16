import type { DigestCategory } from "../types";
export interface SummarizationResult {
    title: string;
    summary: string;
    keyPoints: string[];
    categories: DigestCategory[];
}
/**
 * @google-cloud/vertexai SDK で Gemini を呼び出し、変更ログを日本語ダイジェストに要約する。
 * Cloud Run / Cloud Functions 上では Application Default Credentials (ADC) が自動適用される。
 * 事前に Vertex AI API (aiplatform.googleapis.com) の有効化と、実行サービスアカウントへの
 * roles/aiplatform.user 付与が必要。
 */
export declare function summarizeChangeLog(rawContent: string, originalTitle: string): Promise<SummarizationResult>;
//# sourceMappingURL=geminiSummarizer.d.ts.map