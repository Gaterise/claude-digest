import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TrendingModelsPanel } from "@/components/models/TrendingModelsPanel";
import type { TrendingModel } from "@/generated/api/model";

const models: TrendingModel[] = [
  {
    name: "GPT-6",
    provider: "OpenAI",
    releaseDate: "2026年9月",
    summary: "OpenAI の最新フラッグシップモデル。",
    highlights: ["マルチモーダル強化", "推論性能が向上"],
    url: "https://openai.com/gpt-6",
  },
  {
    name: "Gemini 4",
    provider: "Google",
    releaseDate: "2026年10月",
    summary: "Google の次世代モデル。",
    highlights: ["長文脈"],
    url: null,
  },
];

describe("TrendingModelsPanel コンポーネント", () => {
  it("各モデルの名称・提供元・リリース時期・概要・注目ポイントを表示する", () => {
    render(<TrendingModelsPanel models={models} />);
    const cards = screen.getAllByTestId("trending-model-card");
    expect(cards).toHaveLength(2);
    const first = cards[0];
    expect(within(first).getByRole("heading", { name: "GPT-6" })).toBeInTheDocument();
    expect(within(first).getByText("OpenAI")).toBeInTheDocument();
    expect(within(first).getByText("2026年9月")).toBeInTheDocument();
    expect(within(first).getByText("OpenAI の最新フラッグシップモデル。")).toBeInTheDocument();
    expect(within(first).getByText("推論性能が向上")).toBeInTheDocument();
  });

  it("公式リンクを新しいタブで安全に開く", () => {
    render(<TrendingModelsPanel models={models} />);
    const link = screen.getByRole("link", { name: /GPT-6 の公式情報/ });
    expect(link).toHaveAttribute("href", "https://openai.com/gpt-6");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("URL がない・不正なモデルはリンクを表示しない", () => {
    render(
      <TrendingModelsPanel
        models={[models[1], { ...models[0], name: "Bad", url: "javascript:alert(1)" }]}
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("データがなければ準備中メッセージを表示する", () => {
    render(<TrendingModelsPanel models={[]} />);
    expect(screen.getByText("話題の AI モデル情報を準備中です")).toBeInTheDocument();
  });
});
