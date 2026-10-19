import { describe, it, expect, vi } from "vitest";
import {
  resolveGroundingRedirects,
  fetchRedirectLocation,
} from "../../../functions/src/modelComparison/sourceResolver";

const R1 = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AAA==";
const R2 = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/BBB-_x";

const json = (urls: string[]) =>
  JSON.stringify(urls.map((u, i) => ({ model: `M${i}`, sourceUrl: u })));

describe("resolveGroundingRedirects", () => {
  it("グラウンディング中継 URL を実際の出典 URL に置き換える", async () => {
    const resolve = vi.fn(async (u: string) =>
      u === R1 ? "https://example.com/a" : "https://example.org/b"
    );
    const result = await resolveGroundingRedirects(json([R1, R2]), resolve);
    expect(JSON.parse(result.text)).toEqual([
      { model: "M0", sourceUrl: "https://example.com/a" },
      { model: "M1", sourceUrl: "https://example.org/b" },
    ]);
    expect(result).toMatchObject({ resolved: 2, failed: 0 });
  });

  it("同じ中継 URL は1回だけ解決する", async () => {
    const resolve = vi.fn(async () => "https://example.com/a");
    await resolveGroundingRedirects(json([R1, R1, R1]), resolve);
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("解決できない（null / 例外）中継 URL はそのまま残し、失敗件数に数える", async () => {
    const resolve = vi.fn(async (u: string) => {
      if (u === R1) return null;
      throw new Error("network");
    });
    const result = await resolveGroundingRedirects(json([R1, R2]), resolve);
    expect(JSON.parse(result.text).map((x: { sourceUrl: string }) => x.sourceUrl)).toEqual([R1, R2]);
    expect(result).toMatchObject({ resolved: 0, failed: 2 });
  });

  it("中継 URL 以外の URL には触れない", async () => {
    const resolve = vi.fn();
    const text = json(["https://openai.com/index/gpt-6"]);
    const result = await resolveGroundingRedirects(text, resolve);
    expect(result.text).toBe(text);
    expect(resolve).not.toHaveBeenCalled();
  });

  it("置き換え後も JSON として有効（URL 内の特殊文字をエスケープする）", async () => {
    const result = await resolveGroundingRedirects(json([R1]), async () => 'https://example.com/a"b\\c');
    expect(JSON.parse(result.text)[0].sourceUrl).toBe('https://example.com/a"b\\c');
  });
});

describe("fetchRedirectLocation", () => {
  const res = (status: number, location?: string) =>
    ({ status, headers: new Headers(location ? { location } : {}) }) as Response;

  it("3xx の Location を返す（リダイレクトは追わない HEAD リクエスト）", async () => {
    const fetchImpl = vi.fn(async () => res(302, "https://example.com/page"));
    await expect(fetchRedirectLocation(R1, fetchImpl)).resolves.toBe("https://example.com/page");
    expect(fetchImpl).toHaveBeenCalledWith(
      R1,
      expect.objectContaining({ method: "HEAD", redirect: "manual" })
    );
  });

  it("相対 Location は絶対 URL に変換する", async () => {
    const fetchImpl = vi.fn(async () => res(301, "/moved"));
    await expect(fetchRedirectLocation(R1, fetchImpl)).resolves.toBe(
      "https://vertexaisearch.cloud.google.com/moved"
    );
  });

  it("3xx 以外・Location なし・通信エラーは null", async () => {
    await expect(fetchRedirectLocation(R1, vi.fn(async () => res(200)))).resolves.toBeNull();
    await expect(fetchRedirectLocation(R1, vi.fn(async () => res(404)))).resolves.toBeNull();
    await expect(fetchRedirectLocation(R1, vi.fn(async () => res(302)))).resolves.toBeNull();
    await expect(
      fetchRedirectLocation(R1, vi.fn(async () => Promise.reject(new Error("x"))))
    ).resolves.toBeNull();
  });
});
