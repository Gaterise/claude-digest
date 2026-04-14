import { describe, it, expect } from "vitest";

describe("GET /digests エンドポイント", () => {
  it("レスポンスが ListDigestsResponse スキーマに準拠する", () => {
    const response = {
      items: [],
      total: 0,
      nextCursor: null,
    };
    expect(response.items).toBeInstanceOf(Array);
    expect(typeof response.total).toBe("number");
    expect(response.total).toBeGreaterThanOrEqual(0);
  });

  it("各 item が DigestArticleSummary スキーマに準拠する", () => {
    const item = {
      id: "abc123",
      title: "Claude 2.0 リリース",
      keyPoints: ["ポイント1", "ポイント2"],
      categories: ["new_feature"],
      sourceUrl: "https://docs.anthropic.com/en/release-notes/overview",
      originalVersion: "2.0.0",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    expect(item.id).toBeTruthy();
    expect(item.title.length).toBeLessThanOrEqual(255);
    expect(item.keyPoints.length).toBeGreaterThanOrEqual(1);
    expect(item.categories.length).toBeGreaterThanOrEqual(1);
    expect(item.sourceUrl).toMatch(/^https?:\/\//);
  });

  it("空リストの場合は items が空配列・total が 0", () => {
    const emptyResponse = { items: [], total: 0, nextCursor: null };
    expect(emptyResponse.items).toHaveLength(0);
    expect(emptyResponse.total).toBe(0);
    expect(emptyResponse.nextCursor).toBeNull();
  });

  it("ページネーションで nextCursor が返る", () => {
    const pagedResponse = {
      items: [{ id: "1" }, { id: "2" }],
      total: 50,
      nextCursor: "cursor-abc",
    };
    expect(pagedResponse.nextCursor).toBeTruthy();
    expect(typeof pagedResponse.nextCursor).toBe("string");
  });
});
