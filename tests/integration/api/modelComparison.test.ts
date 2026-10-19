import { describe, it, expect } from "vitest";
import { toModelComparisonResponse } from "../../../functions/src/modelComparison/response";
import type { ModelComparisonData } from "../../../functions/src/types";

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const data: ModelComparisonData = {
  claudeModels: [
    {
      family: "Opus",
      name: "Claude Opus 4.8",
      modelId: "claude-opus-4-8",
      tagline: "高性能",
      context: "100万トークン",
      maxOutput: "12.8万トークン",
      priceInput: "$5.00",
      priceOutput: "$25.00",
      description: "説明",
      strengths: ["得意"],
      guideTitle: "見出し",
      guideText: "本文",
    },
  ],
  claudeNote: "注記",
  claudeModelsUpdatedAt: new Date("2026-10-16T21:00:00.000Z"),
  benchmarks: [
    {
      name: "SWE-bench Verified",
      description: "実務的なコーディング課題",
      unit: "%",
      higherIsBetter: true,
      scores: [{ model: "Claude Opus 4.8", score: 80, sourceUrl: "https://example.com" }],
    },
  ],
  benchmarksUpdatedAt: null,
  trendingModels: [],
  trendingModelsUpdatedAt: null,
};

describe("GET /model-comparison レスポンス契約", () => {
  it("ModelComparisonResponse の必須フィールドをすべて持つ", () => {
    const res = toModelComparisonResponse(data);
    expect(Object.keys(res).sort()).toEqual(
      ["benchmarks", "claudeModels", "claudeNote", "trendingModels", "updatedAt"].sort()
    );
    expect(Object.keys(res.updatedAt).sort()).toEqual(
      ["benchmarks", "claudeModels", "trendingModels"].sort()
    );
  });

  it("日時は ISO 8601 文字列、未更新区分は null", () => {
    const res = toModelComparisonResponse(data);
    expect(res.updatedAt.claudeModels).toMatch(ISO_PATTERN);
    expect(res.updatedAt.benchmarks).toBeNull();
    expect(res.updatedAt.trendingModels).toBeNull();
  });

  it("データ配列と注記をそのまま返す", () => {
    const res = toModelComparisonResponse(data);
    expect(res.claudeModels).toEqual(data.claudeModels);
    expect(res.benchmarks).toEqual(data.benchmarks);
    expect(res.trendingModels).toEqual([]);
    expect(res.claudeNote).toBe("注記");
  });

  it("未生成（null）の場合は空配列と null を返す", () => {
    expect(toModelComparisonResponse(null)).toEqual({
      claudeModels: [],
      claudeNote: null,
      benchmarks: [],
      trendingModels: [],
      updatedAt: { claudeModels: null, benchmarks: null, trendingModels: null },
    });
  });

  it("JSON シリアライズ可能である", () => {
    const res = toModelComparisonResponse(data);
    expect(JSON.parse(JSON.stringify(res))).toEqual(res);
  });
});
