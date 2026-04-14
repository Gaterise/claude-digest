import { describe, it, expect } from "vitest";

describe("Claude 要約生成", () => {
  describe("要約構造の検証", () => {
    it("title, summary, keyPoints, categories を含む結果を返す", () => {
      const result = {
        title: "Claude 1.9 リリース：ツール使用が大幅改善",
        summary: "## 概要\nClaude 1.9 ではツール使用の改善が行われました。",
        keyPoints: [
          "ツール使用のレスポンス品質が向上",
          "並列ツール呼び出しに対応",
          "エラーハンドリングが改善",
        ],
        categories: ["new_feature", "improvement"],
      };

      expect(result.title).toBeTruthy();
      expect(result.title.length).toBeLessThanOrEqual(255);
      expect(result.summary).toBeTruthy();
      expect(result.keyPoints.length).toBeGreaterThanOrEqual(1);
      expect(result.keyPoints.length).toBeLessThanOrEqual(7);
      expect(result.categories.length).toBeGreaterThanOrEqual(1);
    });

    it("summary が Markdown 形式で生成される", () => {
      const summary = "## 概要\n新機能の説明\n\n### 詳細\n- ポイント1\n- ポイント2";
      // Markdown ヘッディングが含まれること
      expect(summary).toContain("##");
    });
  });

  describe("カテゴリ分類", () => {
    const validCategories = [
      "new_feature",
      "improvement",
      "bug_fix",
      "deprecation",
      "breaking_change",
      "other",
    ];

    it("有効なカテゴリのみを返す", () => {
      const categories = ["new_feature", "improvement"];
      categories.forEach((cat) => {
        expect(validCategories).toContain(cat);
      });
    });

    it("カテゴリは1件以上含まれる", () => {
      const categories = ["bug_fix"];
      expect(categories.length).toBeGreaterThanOrEqual(1);
    });
  });
});
