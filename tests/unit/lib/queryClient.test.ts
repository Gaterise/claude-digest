import { describe, it, expect } from "vitest";

describe("TanStack Query クライアント設定", () => {
  it("getQueryClient がQueryClient インスタンスを返す", async () => {
    const { getQueryClient } = await import("@/lib/queryClient");
    const client = getQueryClient();
    expect(client).toBeDefined();
    expect(typeof client.getQueryData).toBe("function");
    expect(typeof client.prefetchQuery).toBe("function");
  });

  it("getQueryClient はシングルトンを返す（同一インスタンス）", async () => {
    const { getQueryClient } = await import("@/lib/queryClient");
    const client1 = getQueryClient();
    const client2 = getQueryClient();
    expect(client1).toBe(client2);
  });
});
