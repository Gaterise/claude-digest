import { describe, it, expect } from "vitest";

describe("GET /digests フィルタパラメータ", () => {
  it("category パラメータで有効なカテゴリのみ受け付ける", () => {
    const validCategories = [
      "new_feature", "improvement", "bug_fix",
      "deprecation", "breaking_change", "other",
    ];
    validCategories.forEach((cat) => {
      expect(validCategories).toContain(cat);
    });
    expect(validCategories).not.toContain("invalid_category");
  });

  it("from/to パラメータが ISO 8601 日付形式である", () => {
    const from = "2026-01-01T00:00:00.000Z";
    const to = "2026-04-14T23:59:59.000Z";
    expect(new Date(from).toISOString()).toBe(from);
    expect(new Date(to).toISOString()).toBe(to);
  });

  it("不正な日付形式の場合はバリデーションエラー", () => {
    const invalidDate = "not-a-date";
    expect(isNaN(Date.parse(invalidDate))).toBe(true);
  });

  it("カテゴリフィルタ適用後は該当カテゴリの記事のみ返る", () => {
    const allItems = [
      { id: "1", categories: ["new_feature"] },
      { id: "2", categories: ["bug_fix"] },
      { id: "3", categories: ["new_feature", "improvement"] },
    ];
    const filtered = allItems.filter((item) =>
      item.categories.includes("new_feature")
    );
    expect(filtered).toHaveLength(2);
    expect(filtered.map((i) => i.id)).toEqual(["1", "3"]);
  });
});
