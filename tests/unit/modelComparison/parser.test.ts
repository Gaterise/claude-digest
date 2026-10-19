import { describe, it, expect } from "vitest";
import {
  extractJson,
  isValidSourceUrl,
  parseClaudeModels,
  parseTrendingModels,
  parseBenchmarks,
  selectBenchmarkCandidates,
} from "../../../functions/src/modelComparison/parser";

const claudeModel = (overrides: Record<string, unknown> = {}) => ({
  family: "Opus",
  name: "Claude Opus 4.8",
  modelId: "claude-opus-4-8",
  tagline: "高性能",
  context: "100万トークン",
  maxOutput: "12.8万トークン",
  priceInput: "$5.00",
  priceOutput: "$25.00",
  description: "高性能なモデル。",
  strengths: ["複雑なコーディング", "エージェント作業"],
  guideTitle: "難しいタスクには Opus。",
  guideText: "大規模な作業に向いています。",
  ...overrides,
});

const trendingModel = (overrides: Record<string, unknown> = {}) => ({
  name: "GPT-6",
  provider: "OpenAI",
  releaseDate: "2026年9月",
  summary: "OpenAI の最新フラッグシップ。",
  highlights: ["マルチモーダル強化", "推論性能向上"],
  url: "https://openai.com/index/gpt-6",
  ...overrides,
});

const benchmark = (name: string, overrides: Record<string, unknown> = {}) => ({
  name,
  description: `${name} の説明`,
  unit: "%",
  higherIsBetter: true,
  scores: [
    { model: "Claude Opus 4.8", score: 80.5, sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8" },
    { model: "GPT-6", score: 78.1, sourceUrl: "https://openai.com/index/gpt-6" },
  ],
  ...overrides,
});

const CANDIDATES = ["Claude Opus 4.8", "GPT-6"];

describe("extractJson", () => {
  it("```json コードブロックを除去してパースする", () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("前後に説明文があっても JSON 部分を抽出する", () => {
    expect(extractJson('結果です:\n[{"a":1}]\n以上')).toEqual([{ a: 1 }]);
  });

  it("JSON が見つからなければ例外を投げる", () => {
    expect(() => extractJson("JSON はありません")).toThrow();
  });

  it("壊れた JSON は例外を投げる", () => {
    expect(() => extractJson('{"a": 1,,}')).toThrow();
  });
});

describe("isValidSourceUrl", () => {
  it("https/http の URL を許可する", () => {
    expect(isValidSourceUrl("https://example.com/a")).toBe(true);
    expect(isValidSourceUrl("http://example.com")).toBe(true);
  });

  it("http/https 以外・不正な文字列・非文字列を拒否する", () => {
    expect(isValidSourceUrl("javascript:alert(1)")).toBe(false);
    expect(isValidSourceUrl("ftp://example.com")).toBe(false);
    expect(isValidSourceUrl("not a url")).toBe(false);
    expect(isValidSourceUrl("")).toBe(false);
    expect(isValidSourceUrl(null)).toBe(false);
    expect(isValidSourceUrl(123)).toBe(false);
  });

  it("Vertex AI のグラウンディング中継 URL を拒否する", () => {
    expect(
      isValidSourceUrl("https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc")
    ).toBe(false);
  });
});

describe("parseClaudeModels", () => {
  it("モデル一覧と注記を返す", () => {
    const text = JSON.stringify({ models: [claudeModel()], note: "旧モデルも利用可能" });
    const result = parseClaudeModels(text);
    expect(result.models).toHaveLength(1);
    expect(result.models[0].modelId).toBe("claude-opus-4-8");
    expect(result.note).toBe("旧モデルも利用可能");
  });

  it("注記がなければ null", () => {
    const result = parseClaudeModels(JSON.stringify({ models: [claudeModel()] }));
    expect(result.note).toBeNull();
  });

  it("必須項目が欠けたモデルは除外する", () => {
    const text = JSON.stringify({
      models: [claudeModel(), claudeModel({ modelId: "" }), claudeModel({ strengths: [] })],
    });
    expect(parseClaudeModels(text).models).toHaveLength(1);
  });

  it("文字列の前後空白を除去し、strengths は最大6件", () => {
    const text = JSON.stringify({
      models: [
        claudeModel({ name: "  Claude Opus 4.8  ", strengths: ["a", "b", "c", "d", "e", "f", "g"] }),
      ],
    });
    const model = parseClaudeModels(text).models[0];
    expect(model.name).toBe("Claude Opus 4.8");
    expect(model.strengths).toHaveLength(6);
  });

  it("最大6件に切り詰める", () => {
    const models = Array.from({ length: 8 }, (_, i) => claudeModel({ modelId: `m-${i}` }));
    expect(parseClaudeModels(JSON.stringify({ models })).models).toHaveLength(6);
  });

  it("有効なモデルが0件なら例外を投げる", () => {
    expect(() => parseClaudeModels(JSON.stringify({ models: [] }))).toThrow();
    expect(() => parseClaudeModels(JSON.stringify({ models: [{ name: "x" }] }))).toThrow();
  });
});

describe("parseTrendingModels", () => {
  const three = [
    trendingModel(),
    trendingModel({ name: "Gemini 4", provider: "Google" }),
    trendingModel({ name: "Grok 5", provider: "xAI" }),
  ];

  it("配列形式の応答をパースする", () => {
    expect(parseTrendingModels(JSON.stringify(three))).toHaveLength(3);
  });

  it("{ models: [...] } 形式の応答もパースする", () => {
    expect(parseTrendingModels(JSON.stringify({ models: three }))).toHaveLength(3);
  });

  it("Claude を含むモデルは除外する", () => {
    const text = JSON.stringify([...three, trendingModel({ name: "Claude Fable 5" })]);
    const names = parseTrendingModels(text).map((m) => m.name);
    expect(names).not.toContain("Claude Fable 5");
  });

  it("不正な URL は null にする", () => {
    const text = JSON.stringify([trendingModel({ url: "javascript:alert(1)" }), ...three.slice(1)]);
    expect(parseTrendingModels(text)[0].url).toBeNull();
  });

  it("highlights は最大4件", () => {
    const text = JSON.stringify([
      trendingModel({ highlights: ["a", "b", "c", "d", "e"] }),
      ...three.slice(1),
    ]);
    expect(parseTrendingModels(text)[0].highlights).toHaveLength(4);
  });

  it("最大6件に切り詰める", () => {
    const many = Array.from({ length: 9 }, (_, i) => trendingModel({ name: `Model ${i}` }));
    expect(parseTrendingModels(JSON.stringify(many))).toHaveLength(6);
  });

  it("有効なモデルが3件未満なら例外を投げる", () => {
    expect(() => parseTrendingModels(JSON.stringify(three.slice(0, 2)))).toThrow();
  });
});

describe("parseBenchmarks", () => {
  const three = [benchmark("SWE-bench Verified"), benchmark("GPQA Diamond"), benchmark("HLE")];

  it("ベンチマーク一覧をパースする", () => {
    const result = parseBenchmarks(JSON.stringify(three), CANDIDATES);
    expect(result).toHaveLength(3);
    expect(result[0].scores).toHaveLength(2);
    expect(result[0].unit).toBe("%");
  });

  it("出典 URL が無効なスコアは破棄する", () => {
    const text = JSON.stringify([
      benchmark("SWE-bench Verified", {
        scores: [
          { model: "Claude Opus 4.8", score: 80, sourceUrl: "https://www.anthropic.com/news" },
          { model: "GPT-6", score: 78 },
          { model: "GPT-6", score: 77, sourceUrl: "javascript:alert(1)" },
        ],
      }),
      ...three.slice(1),
    ]);
    const scores = parseBenchmarks(text, CANDIDATES)[0].scores;
    expect(scores).toHaveLength(1);
    expect(scores[0].model).toBe("Claude Opus 4.8");
  });

  it("候補にないモデルのスコアは破棄する", () => {
    const text = JSON.stringify([
      benchmark("SWE-bench Verified", {
        scores: [
          { model: "Claude Opus 4.8", score: 80, sourceUrl: "https://a.example.com" },
          { model: "Unknown Model", score: 90, sourceUrl: "https://b.example.com" },
        ],
      }),
      ...three.slice(1),
    ]);
    const models = parseBenchmarks(text, CANDIDATES)[0].scores.map((s) => s.model);
    expect(models).toEqual(["Claude Opus 4.8"]);
  });

  it("同一モデルのスコアが重複したら最初の1件のみ残す", () => {
    const text = JSON.stringify([
      benchmark("SWE-bench Verified", {
        scores: [
          { model: "GPT-6", score: 78, sourceUrl: "https://a.example.com" },
          { model: "GPT-6", score: 99, sourceUrl: "https://b.example.com" },
        ],
      }),
      ...three.slice(1),
    ]);
    const scores = parseBenchmarks(text, CANDIDATES)[0].scores;
    expect(scores).toEqual([{ model: "GPT-6", score: 78, sourceUrl: "https://a.example.com" }]);
  });

  it("数値でないスコアは破棄し、数値文字列は数値に変換する", () => {
    const text = JSON.stringify([
      benchmark("SWE-bench Verified", {
        scores: [
          { model: "Claude Opus 4.8", score: "80.5", sourceUrl: "https://a.example.com" },
          { model: "GPT-6", score: "N/A", sourceUrl: "https://b.example.com" },
        ],
      }),
      ...three.slice(1),
    ]);
    const scores = parseBenchmarks(text, CANDIDATES)[0].scores;
    expect(scores).toEqual([
      { model: "Claude Opus 4.8", score: 80.5, sourceUrl: "https://a.example.com" },
    ]);
  });

  it("higherIsBetter 省略時は true、unit 省略時は空文字", () => {
    const text = JSON.stringify([
      benchmark("SWE-bench Verified", { higherIsBetter: undefined, unit: undefined }),
      ...three.slice(1),
    ]);
    const result = parseBenchmarks(text, CANDIDATES)[0];
    expect(result.higherIsBetter).toBe(true);
    expect(result.unit).toBe("");
  });

  it("有効スコアが0件のベンチマークは除外する", () => {
    const text = JSON.stringify([...three, benchmark("ARC-AGI", { scores: [] })]);
    expect(parseBenchmarks(text, CANDIDATES).map((b) => b.name)).not.toContain("ARC-AGI");
  });

  it("最大8件に切り詰める", () => {
    const many = Array.from({ length: 10 }, (_, i) => benchmark(`Bench ${i}`));
    expect(parseBenchmarks(JSON.stringify(many), CANDIDATES)).toHaveLength(8);
  });

  it("有効なベンチマークが3件未満なら例外を投げる", () => {
    expect(() => parseBenchmarks(JSON.stringify(three.slice(0, 2)), CANDIDATES)).toThrow();
  });
});

describe("selectBenchmarkCandidates", () => {
  it("Claude モデルを先頭にし、重複を除いて結合する", () => {
    expect(
      selectBenchmarkCandidates(["Claude Opus 4.8", "Claude Sonnet 4.6"], ["GPT-6", "Claude Opus 4.8"])
    ).toEqual(["Claude Opus 4.8", "Claude Sonnet 4.6", "GPT-6"]);
  });

  it("最大件数（既定10）に切り詰める", () => {
    const claude = ["C1", "C2", "C3", "C4"];
    const others = Array.from({ length: 10 }, (_, i) => `O${i}`);
    const result = selectBenchmarkCandidates(claude, others);
    expect(result).toHaveLength(10);
    expect(result.slice(0, 4)).toEqual(claude);
  });
});
