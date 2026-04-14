import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DigestCard } from "@/components/DigestCard";

const mockArticle = {
  id: "test-1",
  title: "Claude 1.9 リリース：ツール使用が大幅改善",
  keyPoints: ["ツール使用改善", "パフォーマンス向上", "バグ修正"],
  categories: ["new_feature" as const, "improvement" as const],
  sourceUrl: "https://docs.anthropic.com/en/release-notes/overview",
  originalVersion: "1.9.0",
  publishedAt: "2026-04-10T00:00:00.000Z",
  createdAt: "2026-04-10T01:00:00.000Z",
};

describe("DigestCard コンポーネント", () => {
  it("タイトルを表示する", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
  });

  it("keyPoints を表示する（最大3件）", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText("ツール使用改善")).toBeInTheDocument();
    expect(screen.getByText("パフォーマンス向上")).toBeInTheDocument();
    expect(screen.getByText("バグ修正")).toBeInTheDocument();
  });

  it("カテゴリバッジを表示する", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText("新機能")).toBeInTheDocument();
    expect(screen.getByText("改善")).toBeInTheDocument();
  });

  it("公開日を表示する", () => {
    render(<DigestCard article={mockArticle} />);
    // 日付のフォーマットはロケール依存
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("記事詳細へのリンクを含む", () => {
    render(<DigestCard article={mockArticle} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/digests/test-1");
  });
});
