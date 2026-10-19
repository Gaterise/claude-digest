import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BenchmarkPanel } from "@/components/models/BenchmarkPanel";
import type { Benchmark } from "@/generated/api/model";

const benchmarks: Benchmark[] = [
  {
    name: "SWE-bench Verified",
    description: "実際の GitHub Issue を解決するコーディング能力",
    unit: "%",
    higherIsBetter: true,
    scores: [
      { model: "Claude Opus 4.8", score: 82.1, sourceUrl: "https://www.anthropic.com/news/opus" },
      { model: "GPT-6", score: 79.4, sourceUrl: "https://openai.com/gpt-6" },
    ],
  },
  {
    name: "LMArena",
    description: "人間の投票によるレーティング",
    unit: "Elo",
    higherIsBetter: true,
    scores: [
      { model: "GPT-6", score: 1450, sourceUrl: "https://lmarena.ai" },
      { model: "Claude Opus 4.8", score: 1500, sourceUrl: "javascript:alert(1)" },
    ],
  },
];

const claudeNames = ["Claude Opus 4.8", "Claude Sonnet 4.6"];

describe("BenchmarkPanel コンポーネント", () => {
  it("ベンチマーク名・概要・モデル列を表として表示する", () => {
    render(<BenchmarkPanel benchmarks={benchmarks} claudeModelNames={claudeNames} />);
    const table = screen.getByRole("table", { name: "ベンチマーク比較表" });
    const headers = within(table).getAllByRole("columnheader").map((h) => h.textContent);
    expect(headers).toEqual(["ベンチマーク", "Claude Opus 4.8", "GPT-6"]);
    expect(within(table).getByRole("rowheader", { name: /SWE-bench Verified/ })).toBeInTheDocument();
    expect(within(table).getByText("実際の GitHub Issue を解決するコーディング能力")).toBeInTheDocument();
  });

  it("スコアを単位付きで表示し、出典リンクを新しいタブで安全に開く", () => {
    render(<BenchmarkPanel benchmarks={benchmarks} claudeModelNames={claudeNames} />);
    const link = screen.getByRole("link", { name: /Claude Opus 4.8 の SWE-bench Verified スコア 82.1% の出典/ });
    expect(link).toHaveAttribute("href", "https://www.anthropic.com/news/opus");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    expect(screen.getByText("1,450 Elo")).toBeInTheDocument();
  });

  it("出典が無効なスコアは数値を出さず「―」と表示する", () => {
    render(<BenchmarkPanel benchmarks={benchmarks} claudeModelNames={claudeNames} />);
    const cell = screen.getByTestId("benchmark-cell-LMArena-Claude Opus 4.8");
    expect(cell).toHaveTextContent("―");
    expect(cell).not.toHaveTextContent("1,500");
    expect(screen.queryByRole("link", { name: /javascript/ })).not.toBeInTheDocument();
  });

  it("各ベンチマークの最高スコアを強調する", () => {
    render(<BenchmarkPanel benchmarks={benchmarks} claudeModelNames={claudeNames} />);
    expect(screen.getByTestId("benchmark-cell-SWE-bench Verified-Claude Opus 4.8")).toHaveAttribute("data-best", "true");
    expect(screen.getByTestId("benchmark-cell-SWE-bench Verified-GPT-6")).toHaveAttribute("data-best", "false");
    expect(screen.getByTestId("benchmark-cell-LMArena-GPT-6")).toHaveAttribute("data-best", "true");
  });

  it("データがなければ準備中メッセージを表示する", () => {
    render(<BenchmarkPanel benchmarks={[]} claudeModelNames={claudeNames} />);
    expect(screen.getByText("ベンチマーク情報を準備中です")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
