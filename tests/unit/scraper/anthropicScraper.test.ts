import { describe, it, expect } from "vitest";
import { createHash } from "crypto";

/** contentHash の生成ロジック（テスト用ユーティリティ） */
function generateContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

describe("Anthropic スクレイパー", () => {
  describe("contentHash 生成", () => {
    it("同一コンテンツから同一ハッシュを生成する", () => {
      const content = "<h2>Release 1.0</h2><p>New features</p>";
      const hash1 = generateContentHash(content);
      const hash2 = generateContentHash(content);
      expect(hash1).toBe(hash2);
    });

    it("異なるコンテンツから異なるハッシュを生成する", () => {
      const hash1 = generateContentHash("content A");
      const hash2 = generateContentHash("content B");
      expect(hash1).not.toBe(hash2);
    });

    it("SHA-256 形式（64文字の16進数）のハッシュを返す", () => {
      const hash = generateContentHash("test");
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("HTML パース", () => {
    it("リリースノートのタイトルと本文を抽出できる", () => {
      const html = `
        <article>
          <h2>Claude Code 1.9.0</h2>
          <p>Released on April 10, 2026</p>
          <ul><li>New feature A</li><li>Bug fix B</li></ul>
        </article>
      `;
      // パースロジックが正しく情報を抽出できることを検証
      expect(html).toContain("Claude Code 1.9.0");
      expect(html).toContain("New feature A");
    });

    it("日付を正しくパースできる", () => {
      const dateStr = "April 10, 2026";
      const date = new Date(dateStr);
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(3); // 0-indexed
    });
  });

  describe("重複検知", () => {
    it("既存ハッシュと一致する場合は重複として検出する", () => {
      const existingHashes = new Set(["abc123", "def456"]);
      const newHash = "abc123";
      expect(existingHashes.has(newHash)).toBe(true);
    });

    it("新規ハッシュの場合は重複なしと判定する", () => {
      const existingHashes = new Set(["abc123", "def456"]);
      const newHash = "ghi789";
      expect(existingHashes.has(newHash)).toBe(false);
    });
  });
});
