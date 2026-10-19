import { describe, it, expect } from "vitest";
import {
  SEED_CLAUDE_MODELS,
  SEED_CLAUDE_NOTE,
  resolveModelComparison,
  AI_MODEL_TABS,
  DEFAULT_TAB,
  parseTab,
  buildTabSearch,
  isSafeHttpUrl,
  findBestScore,
  getBenchmarkColumns,
  formatScore,
  formatJstDateTime,
  getFamilyTheme,
} from "@/lib/modelComparison";
import type {
  Benchmark,
  ClaudeModel,
  ModelComparisonResponse,
} from "@/generated/api/model";

const claude = (name: string, family = "Opus"): ClaudeModel => ({
  family,
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

const emptyResponse: ModelComparisonResponse = {
  claudeModels: [],
  claudeNote: null,
  benchmarks: [],
  trendingModels: [],
  updatedAt: { claudeModels: null, benchmarks: null, trendingModels: null },
};

describe("初期データ", () => {
  it("現行ページの4モデル（Fable・Opus・Sonnet・Haiku）を持つ", () => {
    expect(SEED_CLAUDE_MODELS.map((m) => m.family)).toEqual(["Fable", "Opus", "Sonnet", "Haiku"]);
    for (const m of SEED_CLAUDE_MODELS) {
      expect(m.guideTitle).toBeTruthy();
      expect(m.strengths.length).toBeGreaterThan(0);
    }
    expect(SEED_CLAUDE_NOTE).toBeTruthy();
  });
});

describe("resolveModelComparison", () => {
  it("API 取得失敗（null）なら Claude は初期データ、他は空", () => {
    const r = resolveModelComparison(null);
    expect(r.claudeModels).toEqual(SEED_CLAUDE_MODELS);
    expect(r.claudeNote).toBe(SEED_CLAUDE_NOTE);
    expect(r.isClaudeSeed).toBe(true);
    expect(r.benchmarks).toEqual([]);
    expect(r.trendingModels).toEqual([]);
    expect(r.claudeUpdatedAt).toBeNull();
    expect(r.aiModelsUpdatedAt).toBeNull();
  });

  it("Claude 区分が空なら初期データにフォールバックする", () => {
    const r = resolveModelComparison(emptyResponse);
    expect(r.claudeModels).toEqual(SEED_CLAUDE_MODELS);
    expect(r.isClaudeSeed).toBe(true);
  });

  it("API データがあればそれを使い、ページごとの更新日時を返す", () => {
    const r = resolveModelComparison({
      ...emptyResponse,
      claudeModels: [claude("Claude Opus 5")],
      claudeNote: null,
      updatedAt: {
        claudeModels: "2026-10-15T21:00:00.000Z",
        benchmarks: "2026-10-16T21:00:00.000Z",
        trendingModels: null,
      },
    });
    expect(r.claudeModels.map((m) => m.name)).toEqual(["Claude Opus 5"]);
    expect(r.claudeNote).toBeNull();
    expect(r.isClaudeSeed).toBe(false);
    expect(r.claudeUpdatedAt).toBe("2026-10-15T21:00:00.000Z");
    // 話題の AI 比較ページはベンチマーク・話題モデルのうち新しい方
    expect(r.aiModelsUpdatedAt).toBe("2026-10-16T21:00:00.000Z");
  });

  it("話題の AI 比較ページの更新日時は2区分のうち最新のもの", () => {
    const r = resolveModelComparison({
      ...emptyResponse,
      updatedAt: {
        claudeModels: "2026-10-18T21:00:00.000Z",
        benchmarks: "2026-10-16T21:00:00.000Z",
        trendingModels: "2026-10-17T21:00:00.000Z",
      },
    });
    expect(r.aiModelsUpdatedAt).toBe("2026-10-17T21:00:00.000Z");
  });
});

describe("AI_MODEL_TABS", () => {
  it("話題の AI モデル → ベンチマーク比較 の2タブ", () => {
    expect(AI_MODEL_TABS.map((t) => t.id)).toEqual(["trending", "benchmarks"]);
    expect(DEFAULT_TAB).toBe("trending");
  });
});

describe("parseTab", () => {
  it("有効なタブ ID を返す", () => {
    expect(parseTab("benchmarks")).toBe("benchmarks");
    expect(parseTab("trending")).toBe("trending");
  });

  it("未指定・不正値・配列は既定の trending", () => {
    expect(parseTab(undefined)).toBe("trending");
    expect(parseTab("unknown")).toBe("trending");
    expect(parseTab("claude")).toBe("trending");
    expect(parseTab(["benchmarks", "trending"])).toBe("benchmarks");
    expect(parseTab([])).toBe("trending");
  });
});

describe("buildTabSearch", () => {
  it("既定タブでは tab パラメータを削除する", () => {
    expect(buildTabSearch("?tab=benchmarks", "trending")).toBe("");
  });

  it("他のパラメータを保持しつつ tab を設定する", () => {
    expect(buildTabSearch("?utm=x", "benchmarks")).toBe("?utm=x&tab=benchmarks");
    expect(buildTabSearch("?tab=trending&utm=x", "benchmarks")).toBe("?tab=benchmarks&utm=x");
  });
});

describe("isSafeHttpUrl", () => {
  it("http/https のみ true", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("//example.com")).toBe(false);
    expect(isSafeHttpUrl("")).toBe(false);
    expect(isSafeHttpUrl(null)).toBe(false);
    expect(isSafeHttpUrl(undefined)).toBe(false);
  });
});

describe("findBestScore", () => {
  const bench = (higherIsBetter: boolean): Benchmark => ({
    name: "B",
    description: "",
    unit: "%",
    higherIsBetter,
    scores: [
      { model: "A", score: 70, sourceUrl: "https://a.example.com" },
      { model: "B", score: 90, sourceUrl: "https://b.example.com" },
      { model: "C", score: 99, sourceUrl: "javascript:alert(1)" },
      { model: "D", score: 10, sourceUrl: "" },
    ],
  });

  it("出典が有効なスコアの中で最高値を返す", () => {
    expect(findBestScore(bench(true))).toBe(90);
  });

  it("higherIsBetter=false なら最小値を返す", () => {
    expect(findBestScore(bench(false))).toBe(70);
  });

  it("有効なスコアがなければ null", () => {
    expect(findBestScore({ ...bench(true), scores: [] })).toBeNull();
  });
});

describe("getBenchmarkColumns", () => {
  it("Claude モデルを Claude 一覧の順で先頭に、その他は登場順で並べる", () => {
    const benchmarks: Benchmark[] = [
      {
        name: "B1",
        description: "",
        unit: "%",
        higherIsBetter: true,
        scores: [
          { model: "GPT-6", score: 1, sourceUrl: "https://a.example.com" },
          { model: "Claude Sonnet 4.6", score: 1, sourceUrl: "https://a.example.com" },
        ],
      },
      {
        name: "B2",
        description: "",
        unit: "%",
        higherIsBetter: true,
        scores: [
          { model: "Gemini 4", score: 1, sourceUrl: "https://a.example.com" },
          { model: "Claude Opus 4.8", score: 1, sourceUrl: "https://a.example.com" },
          { model: "GPT-6", score: 1, sourceUrl: "https://a.example.com" },
        ],
      },
    ];
    expect(
      getBenchmarkColumns(benchmarks, ["Claude Opus 4.8", "Claude Sonnet 4.6", "Claude Haiku 4.5"])
    ).toEqual(["Claude Opus 4.8", "Claude Sonnet 4.6", "GPT-6", "Gemini 4"]);
  });
});

describe("formatScore", () => {
  it("% は数値に直結し、その他の単位は空白区切り", () => {
    expect(formatScore(80.5, "%")).toBe("80.5%");
    expect(formatScore(1420, "Elo")).toBe("1,420 Elo");
    expect(formatScore(3.25, "")).toBe("3.25");
  });
});

describe("formatJstDateTime", () => {
  it("日本時間の日時に整形する", () => {
    expect(formatJstDateTime("2026-10-16T21:00:00.000Z")).toBe("2026年10月17日 06:00");
  });
});

describe("getFamilyTheme", () => {
  it("既知ファミリーは固有テーマ、未知はフォールバック", () => {
    expect(getFamilyTheme("Opus").key).toBe("opus");
    expect(getFamilyTheme("sonnet").key).toBe("sonnet");
    expect(getFamilyTheme("Mythos").key).toBe("default");
  });
});
