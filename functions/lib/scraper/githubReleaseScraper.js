"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentHash = generateContentHash;
exports.fetchGitHubReleases = fetchGitHubReleases;
exports.fetchAllGitHubReleases = fetchAllGitHubReleases;
exports.parseReleases = parseReleases;
const crypto_1 = require("crypto");
const GITHUB_API_URL = "https://api.github.com/repos/anthropics/claude-code/releases";
/** コンテンツの SHA-256 ハッシュを生成する */
function generateContentHash(content) {
    return (0, crypto_1.createHash)("sha256").update(content).digest("hex");
}
/**
 * anthropics/claude-code リポジトリの GitHub Releases を取得してパースする。
 * GitHub API レート制限: 認証なし 60 req/h、GITHUB_TOKEN 使用時 5,000 req/h。
 * perPage はデフォルト 30（最大 100）。
 */
async function fetchGitHubReleases(perPage = 30, page = 1) {
    const url = `${GITHUB_API_URL}?per_page=${perPage}&page=${page}`;
    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "ClaudeDigest/1.0 (changelog-aggregator)",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    // GITHUB_TOKEN が設定されていればレート制限を 5,000 req/h に引き上げる
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`GitHub Releases API 取得失敗: HTTP ${response.status} ${response.statusText}`);
    }
    const releases = (await response.json());
    return parseReleases(releases);
}
/**
 * 全ページを取得してすべてのリリースを返す。
 * ページネーション終了判定はフィルタ前の生件数で行う（draft除外後に件数が減っても止まらないように）。
 */
async function fetchAllGitHubReleases() {
    const all = [];
    let page = 1;
    const perPage = 100;
    while (true) {
        const url = `${GITHUB_API_URL}?per_page=${perPage}&page=${page}`;
        const headers = {
            Accept: "application/vnd.github+json",
            "User-Agent": "ClaudeDigest/1.0 (changelog-aggregator)",
            "X-GitHub-Api-Version": "2022-11-28",
        };
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            headers["Authorization"] = `Bearer ${githubToken}`;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`GitHub Releases API 取得失敗: HTTP ${response.status} ${response.statusText}`);
        }
        const releases = (await response.json());
        all.push(...parseReleases(releases));
        // フィルタ前の生件数で判定することで draft 除外による誤終了を防ぐ
        if (releases.length < perPage)
            break;
        page++;
    }
    return all;
}
/** GitHub Releases レスポンスを ScrapedEntry 配列に変換する */
function parseReleases(releases) {
    return releases
        .filter((r) => !r.draft) // ドラフトは除外
        .map((r) => {
        const rawContent = r.body ?? "";
        const contentHash = generateContentHash(r.tag_name + rawContent);
        // タグ名からセマンティックバージョンを抽出（例: "v2.1.107" → "2.1.107"）
        const versionMatch = r.tag_name.match(/v?(\d+\.\d+(?:\.\d+)?(?:[.-].+)?)/);
        const version = versionMatch ? versionMatch[1] : null;
        // リリース名が空の場合はタグ名をタイトルとして使用
        const title = (r.name && r.name.trim()) ? r.name.trim() : r.tag_name;
        const publishedAt = r.published_at
            ? new Date(r.published_at)
            : new Date(r.created_at);
        return {
            title,
            tagName: r.tag_name,
            version,
            publishedAt,
            rawContent,
            contentHash,
            sourceUrl: r.html_url,
        };
    });
}
//# sourceMappingURL=githubReleaseScraper.js.map