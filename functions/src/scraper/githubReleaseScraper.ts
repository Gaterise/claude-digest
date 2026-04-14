import { createHash } from "crypto";

const GITHUB_API_URL =
  "https://api.github.com/repos/anthropics/claude-code/releases";

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
export function generateContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

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
export async function fetchGitHubReleases(
  perPage = 30,
  page = 1
): Promise<ScrapedEntry[]> {
  const url = `${GITHUB_API_URL}?per_page=${perPage}&page=${page}`;
  const headers: Record<string, string> = {
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
    throw new Error(
      `GitHub Releases API 取得失敗: HTTP ${response.status} ${response.statusText}`
    );
  }

  const releases = (await response.json()) as GitHubRelease[];
  return parseReleases(releases);
}

/** GitHub Releases レスポンスを ScrapedEntry 配列に変換する */
export function parseReleases(releases: GitHubRelease[]): ScrapedEntry[] {
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
      } satisfies ScrapedEntry;
    });
}
