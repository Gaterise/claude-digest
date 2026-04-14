import { describe, it, expect } from "vitest";

describe("Firebase クライアント初期化", () => {
  it("firebase モジュールが getApp と getFirestore をエクスポートする", async () => {
    const firebaseModule = await import("@/lib/firebase");
    expect(firebaseModule).toBeDefined();
    expect(firebaseModule.app).toBeDefined();
    expect(firebaseModule.db).toBeDefined();
  });

  it("Firestore インスタンスが非 null である", async () => {
    const { db } = await import("@/lib/firebase");
    expect(db).not.toBeNull();
  });
});
