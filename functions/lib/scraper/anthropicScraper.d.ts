export interface ScrapedEntry {
    title: string;
    version: string | null;
    publishedAt: Date;
    rawContent: string;
    contentHash: string;
    sourceUrl: string;
}
/** コンテンツの SHA-256 ハッシュを生成する */
export declare function generateContentHash(content: string): string;
/** Anthropic 公式リリースノートページを取得してパースする */
export declare function scrapeReleaseNotes(): Promise<ScrapedEntry[]>;
/** HTML をパースしてリリースノートエントリを抽出する */
export declare function parseReleaseNotes(html: string): ScrapedEntry[];
//# sourceMappingURL=anthropicScraper.d.ts.map