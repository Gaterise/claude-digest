import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ClaudeModelsPanel } from "@/components/models/ClaudeModelsPanel";
import type { ClaudeModel } from "@/generated/api/model";

const models: ClaudeModel[] = [
  {
    family: "Opus",
    name: "Claude Opus 4.8",
    modelId: "claude-opus-4-8",
    tagline: "高性能",
    context: "100万トークン",
    maxOutput: "12.8万トークン",
    priceInput: "$5.00",
    priceOutput: "$25.00",
    description: "最も高性能なモデル。",
    strengths: ["複雑なコーディング", "自律エージェント"],
    guideTitle: "難しいタスクには Opus。",
    guideText: "大規模なリファクタリングに。",
  },
  {
    family: "Haiku",
    name: "Claude Haiku 4.5",
    modelId: "claude-haiku-4-5",
    tagline: "高速・低コスト",
    context: "20万トークン",
    maxOutput: "6.4万トークン",
    priceInput: "$1.00",
    priceOutput: "$5.00",
    description: "最速のモデル。",
    strengths: ["大量処理"],
    guideTitle: "速さとコスト重視なら Haiku。",
    guideText: "リアルタイム用途に。",
  },
];

describe("ClaudeModelsPanel コンポーネント", () => {
  it("各モデルのカード（名称・モデルID・位置づけ・説明・得意分野）を表示する", () => {
    render(<ClaudeModelsPanel models={models} note={null} />);
    const card = screen.getByTestId("claude-model-card-claude-opus-4-8");
    expect(within(card).getByRole("heading", { name: "Claude Opus 4.8" })).toBeInTheDocument();
    expect(within(card).getByText("claude-opus-4-8")).toBeInTheDocument();
    expect(within(card).getByText("高性能")).toBeInTheDocument();
    expect(within(card).getByText("最も高性能なモデル。")).toBeInTheDocument();
    expect(within(card).getByText("複雑なコーディング")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^claude-model-card-/)).toHaveLength(2);
  });

  it("スペック比較表にコンテキスト長・最大出力・価格を表示する", () => {
    render(<ClaudeModelsPanel models={models} note={null} />);
    const table = screen.getByRole("table", { name: "スペック比較表" });
    expect(within(table).getByText("コンテキスト長")).toBeInTheDocument();
    expect(within(table).getByText("20万トークン")).toBeInTheDocument();
    expect(within(table).getByText("$25.00")).toBeInTheDocument();
    expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(
      expect.arrayContaining(["Opus", "Haiku"])
    );
  });

  it("使い分けガイドを表示する", () => {
    render(<ClaudeModelsPanel models={models} note={null} />);
    expect(screen.getByRole("heading", { name: "どのモデルを選べばいい？" })).toBeInTheDocument();
    expect(screen.getByText("難しいタスクには Opus。")).toBeInTheDocument();
    expect(screen.getByText("リアルタイム用途に。")).toBeInTheDocument();
  });

  it("注記がある場合のみ表示する", () => {
    const { rerender } = render(<ClaudeModelsPanel models={models} note="旧モデルも利用可能です。" />);
    expect(screen.getByText(/旧モデルも利用可能です。/)).toBeInTheDocument();
    rerender(<ClaudeModelsPanel models={models} note={null} />);
    expect(screen.queryByText(/旧モデルも利用可能です。/)).not.toBeInTheDocument();
  });
});
