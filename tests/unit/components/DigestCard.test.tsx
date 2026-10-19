import { CATEGORY_TONE } from "@/lib/categoryTone";
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

  it("日本時間の公開時刻を表示する", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("バージョン番号を表示する", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText("1.9.0")).toBeInTheDocument();
  });

  it("分類を色付きの札で表示する", () => {
    render(<DigestCard article={mockArticle} />);
    expect(screen.getByText("新機能").closest("li")).toHaveClass(...CATEGORY_TONE.new_feature.tag.split(" "));
    expect(screen.getByText("改善").closest("li")).toHaveClass(...CATEGORY_TONE.improvement.tag.split(" "));
  });

  it("バージョンと時刻を1行目にまとめ、その後に分類を並べる（重ならない縦並び）", () => {
    render(<DigestCard article={{ ...mockArticle, originalVersion: "2.1.303" }} />);
    const meta = screen.getByTestId("digest-meta");
    expect(meta).toHaveTextContent("2.1.303");
    expect(meta).toHaveTextContent("09:00");
    const categories = screen.getByRole("list", { name: "分類" });
    expect(meta.compareDocumentPosition(categories) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(meta.contains(categories)).toBe(false);
  });
});
