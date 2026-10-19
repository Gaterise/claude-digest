import { describe, it, expect } from "vitest";
import { CATEGORY_TONE } from "@/lib/categoryTone";

const categories = ["new_feature", "improvement", "bug_fix", "deprecation", "breaking_change", "other"] as const;

describe("CATEGORY_TONE", () => {
  it("全分類に札（tag）と塗りつぶし（solid）の配色を持つ", () => {
    for (const c of categories) {
      expect(CATEGORY_TONE[c].tag).toMatch(/\S/);
      expect(CATEGORY_TONE[c].solid).toMatch(/\S/);
    }
  });

  it("分類ごとに塗りつぶし色が異なり、見分けられる", () => {
    const solids = categories.map((c) => CATEGORY_TONE[c].solid);
    expect(new Set(solids).size).toBe(categories.length);
  });
});
