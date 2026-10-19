import { describe, it, expect, vi } from "vitest";
import { updateModelComparison } from "../../../functions/src/modelComparison/updater";
import type {
  Benchmark,
  ClaudeModel,
  ModelComparisonData,
  TrendingModel,
} from "../../../functions/src/types";

const NOW = new Date("2026-10-16T21:00:00.000Z");
const PREV_DATE = new Date("2026-10-15T21:00:00.000Z");

const claude = (name: string): ClaudeModel => ({
  family: name.split(" ")[1] ?? "Opus",
  name,
  modelId: name.toLowerCase().replace(/ /g, "-"),
  tagline: "高性能",
  context: "100万トークン",
  maxOutput: "12.8万トークン",
  priceInput: "$5.00",
  priceOutput: "$25.00",
  description: "説明",
  strengths: ["得意"],
  guideTitle: "見出し",
  guideText: "本文",
});

const trending = (name: string): TrendingModel => ({
  name,
  provider: "Vendor",
  releaseDate: "2026年10月",
  summary: "概要",
  highlights: ["注目"],
  url: "https://example.com",
});

const bench = (name: string): Benchmark => ({
  name,
  description: "説明",
  unit: "%",
  higherIsBetter: true,
  scores: [{ model: "Claude Opus 4.8", score: 80, sourceUrl: "https://example.com" }],
});

const previous: ModelComparisonData = {
  claudeModels: [claude("Claude Opus 4.7")],
  claudeNote: "前回の注記",
  claudeModelsUpdatedAt: PREV_DATE,
  benchmarks: [bench("Old Bench")],
  benchmarksUpdatedAt: PREV_DATE,
  trendingModels: [trending("Old Model")],
  trendingModelsUpdatedAt: PREV_DATE,
};

function makeGenerators(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    generateClaudeModels: vi.fn().mockResolvedValue({
      models: [claude("Claude Opus 4.8"), claude("Claude Sonnet 4.6")],
      note: "新しい注記",
    }),
    generateTrendingModels: vi.fn().mockResolvedValue([trending("GPT-6"), trending("Gemini 4")]),
    generateBenchmarks: vi.fn().mockResolvedValue([bench("SWE-bench Verified")]),
    ...overrides,
  };
}

describe("updateModelComparison", () => {
  it("全区分が成功したら全て新データと now で置き換える", async () => {
    const generators = makeGenerators();
    const { data, errors } = await updateModelComparison({ previous, generators, now: NOW });

    expect(errors).toEqual([]);
    expect(data).toEqual({
      claudeModels: [claude("Claude Opus 4.8"), claude("Claude Sonnet 4.6")],
      claudeNote: "新しい注記",
      claudeModelsUpdatedAt: NOW,
      benchmarks: [bench("SWE-bench Verified")],
      benchmarksUpdatedAt: NOW,
      trendingModels: [trending("GPT-6"), trending("Gemini 4")],
      trendingModelsUpdatedAt: NOW,
    });
  });

  it("ベンチマーク生成には Claude → 話題モデルの順で候補モデル名を渡す", async () => {
    const generators = makeGenerators();
    await updateModelComparison({ previous, generators, now: NOW });

    expect(generators.generateBenchmarks).toHaveBeenCalledWith([
      "Claude Opus 4.8",
      "Claude Sonnet 4.6",
      "GPT-6",
      "Gemini 4",
    ]);
  });

  it("Claude 区分が失敗したら前回データを維持し、他区分は更新する", async () => {
    const generators = makeGenerators({
      generateClaudeModels: vi.fn().mockRejectedValue(new Error("JSON 破損")),
    });
    const { data, errors } = await updateModelComparison({ previous, generators, now: NOW });

    expect(data?.claudeModels).toEqual(previous.claudeModels);
    expect(data?.claudeNote).toBe("前回の注記");
    expect(data?.claudeModelsUpdatedAt).toEqual(PREV_DATE);
    expect(data?.trendingModelsUpdatedAt).toEqual(NOW);
    expect(data?.benchmarksUpdatedAt).toEqual(NOW);
    expect(errors).toEqual([{ section: "claudeModels", message: "JSON 破損" }]);
    // 前回の Claude モデル名を候補に使う
    expect(generators.generateBenchmarks).toHaveBeenCalledWith([
      "Claude Opus 4.7",
      "GPT-6",
      "Gemini 4",
    ]);
  });

  it("話題モデル・ベンチマーク区分が失敗したら前回データを維持する", async () => {
    const generators = makeGenerators({
      generateTrendingModels: vi.fn().mockRejectedValue(new Error("trend fail")),
      generateBenchmarks: vi.fn().mockRejectedValue(new Error("bench fail")),
    });
    const { data, errors } = await updateModelComparison({ previous, generators, now: NOW });

    expect(data?.claudeModelsUpdatedAt).toEqual(NOW);
    expect(data?.trendingModels).toEqual(previous.trendingModels);
    expect(data?.trendingModelsUpdatedAt).toEqual(PREV_DATE);
    expect(data?.benchmarks).toEqual(previous.benchmarks);
    expect(data?.benchmarksUpdatedAt).toEqual(PREV_DATE);
    expect(errors.map((e) => e.section)).toEqual(["trendingModels", "benchmarks"]);
  });

  it("全区分が失敗したら data は null（書き込みしない）", async () => {
    const generators = makeGenerators({
      generateClaudeModels: vi.fn().mockRejectedValue(new Error("a")),
      generateTrendingModels: vi.fn().mockRejectedValue(new Error("b")),
      generateBenchmarks: vi.fn().mockRejectedValue(new Error("c")),
    });
    const { data, errors } = await updateModelComparison({ previous, generators, now: NOW });

    expect(data).toBeNull();
    expect(errors).toHaveLength(3);
  });

  it("前回データがなく失敗した区分は空配列・null になる", async () => {
    const generators = makeGenerators({
      generateTrendingModels: vi.fn().mockRejectedValue(new Error("b")),
    });
    const { data } = await updateModelComparison({ previous: null, generators, now: NOW });

    expect(data?.trendingModels).toEqual([]);
    expect(data?.trendingModelsUpdatedAt).toBeNull();
    expect(data?.claudeModelsUpdatedAt).toEqual(NOW);
  });

  it("Claude モデル名が1件もなければベンチマーク生成を呼ばずに失敗扱いにする", async () => {
    const generators = makeGenerators({
      generateClaudeModels: vi.fn().mockRejectedValue(new Error("a")),
    });
    const { data, errors } = await updateModelComparison({ previous: null, generators, now: NOW });

    expect(generators.generateBenchmarks).not.toHaveBeenCalled();
    expect(data?.benchmarks).toEqual([]);
    expect(errors.map((e) => e.section)).toContain("benchmarks");
  });
});
