import { createHash } from "crypto";
import * as cheerio from "cheerio";

const SOURCE_URL = "https://docs.anthropic.com/en/release-notes/overview";

export interface ScrapedEntry {
  title: string;
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

/** Anthropic 公式リリースノートページを取得してパースする */
export async function scrapeReleaseNotes(): Promise<ScrapedEntry[]> {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "ClaudeDigest/1.0 (changelog-aggregator)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `スクレイピング失敗: HTTP ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  return parseReleaseNotes(html);
}

/** HTML をパースしてリリースノートエントリを抽出する */
export function parseReleaseNotes(html: string): ScrapedEntry[] {
  const $ = cheerio.load(html);
  const entries: ScrapedEntry[] = [];

  // リリースノートの各セクション（h2 または article で区切られている想定）
  $("article, section, [data-testid='release-note']").each((_, element) => {
    const $el = $(element);
    const title =
      $el.find("h2, h3").first().text().trim() ||
      $el.find("h1").first().text().trim();
    if (!title) return;

    const rawContent = $el.html() || "";
    const contentHash = generateContentHash(rawContent);

    // バージョン番号を抽出（例: "1.9.0", "v2.0"）
    const versionMatch = title.match(/v?(\d+\.\d+(?:\.\d+)?)/);
    const version = versionMatch ? versionMatch[1] : null;

    // 日付を抽出
    const dateText =
      $el.find("time").attr("datetime") ||
      $el.find("[class*='date']").text().trim() ||
      "";
    const publishedAt = dateText ? new Date(dateText) : new Date();

    entries.push({
      title,
      version,
      publishedAt,
      rawContent,
      contentHash,
      sourceUrl: SOURCE_URL,
    });
  });

  // article/section で見つからない場合は h2 ベースで分割
  if (entries.length === 0) {
    const h2s = $("h2");
    h2s.each((_, h2El) => {
      const $h2 = $(h2El);
      const title = $h2.text().trim();
      if (!title) return;

      // h2 の次の兄弟要素を次の h2 まで収集
      let rawContent = "";
      let $next = $h2.next();
      while ($next.length > 0 && !$next.is("h2")) {
        rawContent += $.html($next);
        $next = $next.next();
      }

      const contentHash = generateContentHash(title + rawContent);
      const versionMatch = title.match(/v?(\d+\.\d+(?:\.\d+)?)/);

      entries.push({
        title,
        version: versionMatch ? versionMatch[1] : null,
        publishedAt: new Date(),
        rawContent,
        contentHash,
        sourceUrl: SOURCE_URL,
      });
    });
  }

  return entries;
}
