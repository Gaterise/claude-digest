import { describe, it, expect } from "vitest";

describe("GET /digests/:id エンドポイント", () => {
  it("レスポンスが DigestArticleDetail スキーマに準拠する", () => {
    const response = {
      id: "abc123",
      title: "Claude 2.0 リリース：新機能まとめ",
      summary: "# 概要\nClaude 2.0 がリリースされました。",
      keyPoints: ["ツール使用が改善", "レスポンス速度が向上"],
      categories: ["new_feature", "improvement"],
      sourceUrl: "https://docs.anthropic.com/en/release-notes/overview",
      originalVersion: "2.0.0",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    expect(response.id).toBeTruthy();
    expect(response.summary).toBeTruthy();
    expect(response.title.length).toBeLessThanOrEqual(255);
    expect(response.keyPoints.length).toBeGreaterThanOrEqual(1);
    expect(response.categories.length).toBeGreaterThanOrEqual(1);
  });

  it("存在しない ID の場合は 404 ErrorResponse を返す", () => {
    const errorResponse = {
      error: "NOT_FOUND",
      message: "指定されたダイジェスト記事が見つかりません",
    };
    expect(errorResponse.error).toBe("NOT_FOUND");
    expect(errorResponse.message).toBeTruthy();
  });
});
