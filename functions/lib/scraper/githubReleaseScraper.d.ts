export interface ScrapedEntry {
    title: string;
    tagName: string;
    version: string | null;
    publishedAt: Date;
    rawContent: string;
    contentHash: string;
    sourceUrl: string;
}
/** コンテンツの SHA-256 ハッシュを生成する */
export declare function generateContentHash(content: string): string;
/** GitHub Releases API のレスポンス型（必要なフィールドのみ） */
interface GitHubRelease {
    id: number;
    html_url: string;
    tag_name: string;
    name: string | null;
    body: string | null;
    draft: boolean;
    prerelease: boolean;
    published_at: string | null;
    created_at: string;
}
/**
 * anthropics/claude-code リポジトリの GitHub Releases を取得してパースする。
 * GitHub API レート制限: 認証なし 60 req/h、GITHUB_TOKEN 使用時 5,000 req/h。
 * perPage はデフォルト 30（最大 100）。
 */
export declare function fetchGitHubReleases(perPage?: number, page?: number): Promise<ScrapedEntry[]>;
/** GitHub Releases レスポンスを ScrapedEntry 配列に変換する */
export declare function parseReleases(releases: GitHubRelease[]): ScrapedEntry[];
export {};
//# sourceMappingURL=githubReleaseScraper.d.ts.map