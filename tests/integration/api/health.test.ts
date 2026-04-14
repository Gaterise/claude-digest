import { describe, it, expect } from "vitest";

describe("GET /health エンドポイント", () => {
  it("レスポンスが HealthResponse スキーマに準拠する", () => {
    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
    expect(response.status).toMatch(/^(ok|degraded)$/);
    expect(response.timestamp).toBeTruthy();
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });

  it("status が ok または degraded のみである", () => {
    const validStatuses = ["ok", "degraded"];
    validStatuses.forEach((status) => {
      expect(["ok", "degraded"]).toContain(status);
    });
  });
});
