import type { DigestCategory } from "../types";
export interface SummarizationResult {
    title: string;
    summary: string;
    keyPoints: string[];
    categories: DigestCategory[];
}
/** 変更ログの生コンテンツを日本語ダイジェストに要約する */
export declare function summarizeChangeLog(rawContent: string, originalTitle: string): Promise<SummarizationResult>;
//# sourceMappingURL=claudeSummarizer.d.ts.map