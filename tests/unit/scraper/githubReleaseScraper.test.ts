import { describe, it, expect } from "vitest";
import {
  generateContentHash,
  parseReleases,
} from "../../../functions/src/scraper/githubReleaseScraper";

// GitHub Releases API レスポンスのモックデータ
const mockRelease = {
  id: 308667350,
  html_url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.107",
  tag_name: "v2.1.107",
  name: "v2.1.107",
  body: "## What's changed\n\n- Show thinking hints sooner during long operations\n",
  draft: false,
  prerelease: false,
  published_at: "2026-04-14T06:11:20Z",
  created_at: "2026-04-14T06:11:15Z",
};

describe("GitHub Release スクレイパー", () => {
  describe("generateContentHash", () => {
    it("同一コンテンツから同一ハッシュを生成する", () => {
      const content = "v2.1.107## What's changed\n- Show thinking hints";
      const hash1 = generateContentHash(content);
      const hash2 = generateContentHash(content);
      expect(hash1).toBe(hash2);
    });

    it("異なるコンテンツから異なるハッシュを生成する", () => {
      const hash1 = generateContentHash("v2.1.107content A");
      const hash2 = generateContentHash("v2.1.108content B");
      expect(hash1).not.toBe(hash2);
    });

    it("SHA-256 形式（64文字の16進数）のハッシュを返す", () => {
      const hash = generateContentHash("test");
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("parseReleases", () => {
    it("リリース情報を正しくパースする", () => {
      const entries = parseReleases([mockRelease]);
      expect(entries).toHaveLength(1);

      const entry = entries[0];
      expect(entry.tagName).toBe("v2.1.107");
      expect(entry.title).toBe("v2.1.107");
      expect(entry.version).toBe("2.1.107");
      expect(entry.sourceUrl).toBe(
        "https://github.com/anthropics/claude-code/releases/tag/v2.1.107"
      );
      expect(entry.rawContent).toContain("Show thinking hints");
    });

    it("published_at から publishedAt を正しくパースする", () => {
      const entries = parseReleases([mockRelease]);
      expect(entries[0].publishedAt).toEqual(new Date("2026-04-14T06:11:20Z"));
    });

    it("published_at が null の場合は created_at を使用する", () => {
      const releaseWithoutPublishedAt = { ...mockRelease, published_at: null };
      const entries = parseReleases([releaseWithoutPublishedAt]);
      expect(entries[0].publishedAt).toEqual(new Date("2026-04-14T06:11:15Z"));
    });

    it("ドラフトリリースは除外する", () => {
      const draftRelease = { ...mockRelease, draft: true };
      const entries = parseReleases([draftRelease]);
      expect(entries).toHaveLength(0);
    });

    it("プレリリースは除外しない（デフォルト）", () => {
      const preRelease = { ...mockRelease, prerelease: true };
      const entries = parseReleases([preRelease]);
      expect(entries).toHaveLength(1);
    });

    it("タグ名からセマンティックバージョンを抽出する", () => {
      const entries = parseReleases([{ ...mockRelease, tag_name: "v2.1.107" }]);
      expect(entries[0].version).toBe("2.1.107");
    });

    it("セマンティックバージョンでないタグは version を null にする", () => {
      const entries = parseReleases([{ ...mockRelease, tag_name: "beta" }]);
      expect(entries[0].version).toBeNull();
    });

    it("name が空の場合は tag_name をタイトルとして使用する", () => {
      const entries = parseReleases([
        { ...mockRelease, name: null },
      ]);
      expect(entries[0].title).toBe("v2.1.107");
    });

    it("contentHash は tagName + body から生成する", () => {
      const entries = parseReleases([mockRelease]);
      const expectedHash = generateContentHash(
        mockRelease.tag_name + (mockRelease.body ?? "")
      );
      expect(entries[0].contentHash).toBe(expectedHash);
    });

    it("複数リリースを正しくパースする", () => {
      const release2 = {
        ...mockRelease,
        id: 308569432,
        tag_name: "v2.1.105",
        name: "v2.1.105",
        html_url:
          "https://github.com/anthropics/claude-code/releases/tag/v2.1.105",
        body: "## What's changed\n\n- Added path parameter\n",
        published_at: "2026-04-13T21:53:13Z",
        created_at: "2026-04-13T21:53:07Z",
      };
      const entries = parseReleases([mockRelease, release2]);
      expect(entries).toHaveLength(2);
      expect(entries[0].tagName).toBe("v2.1.107");
      expect(entries[1].tagName).toBe("v2.1.105");
    });

    it("body が null の場合は rawContent を空文字列にする", () => {
      const releaseWithNullBody = { ...mockRelease, body: null };
      const entries = parseReleases([releaseWithNullBody]);
      expect(entries[0].rawContent).toBe("");
    });
  });

  describe("重複検知", () => {
    it("同じ tagName + body のリリースは同一ハッシュを生成する", () => {
      const entries1 = parseReleases([mockRelease]);
      const entries2 = parseReleases([{ ...mockRelease }]);
      expect(entries1[0].contentHash).toBe(entries2[0].contentHash);
    });

    it("body が変わるとハッシュも変わる", () => {
      const entries1 = parseReleases([mockRelease]);
      const entries2 = parseReleases([
        { ...mockRelease, body: "## Updated body\n" },
      ]);
      expect(entries1[0].contentHash).not.toBe(entries2[0].contentHash);
    });
  });
});
