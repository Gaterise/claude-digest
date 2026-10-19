import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DigestDetail } from "@/components/DigestDetail";

const mockDetail = {
  id: "test-1",
  title: "Claude 1.9 リリース：ツール使用が大幅改善",
  summary:
    "## 概要\nClaude 1.9 ではツール使用の品質が大幅に改善されました。\n\n### 主な変更点\n- ツール使用のレスポンスが高速化\n- エラーハンドリング改善",
  keyPoints: ["ツール使用改善", "パフォーマンス向上", "バグ修正"],
  categories: ["new_feature" as const, "improvement" as const],
  sourceUrl: "https://docs.anthropic.com/en/release-notes/overview",
  originalVersion: "1.9.0",
  publishedAt: "2026-04-10T00:00:00.000Z",
  createdAt: "2026-04-10T01:00:00.000Z",
};

describe("DigestDetail コンポーネント", () => {
  it("タイトルを表示する", () => {
    render(<DigestDetail article={mockDetail} />);
    expect(screen.getByText(mockDetail.title)).toBeInTheDocument();
  });

  it("summary をレンダリングする", () => {
    render(<DigestDetail article={mockDetail} />);
    expect(screen.getByText(/概要/)).toBeInTheDocument();
  });

  it("keyPoints を全て表示する", () => {
    render(<DigestDetail article={mockDetail} />);
    mockDetail.keyPoints.forEach((point) => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });
  });

  it("公式変更ログへのリンクを表示する", () => {
    render(<DigestDetail article={mockDetail} />);
    const link = screen.getByRole("link", { name: /公式/ });
    expect(link).toHaveAttribute("href", mockDetail.sourceUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("カテゴリバッジを表示する", () => {
    render(<DigestDetail article={mockDetail} />);
    expect(screen.getByText("新機能")).toBeInTheDocument();
    expect(screen.getByText("改善")).toBeInTheDocument();
  });

  it("見出し（h1）に記事タイトルを掲げる", () => {
    render(<DigestDetail article={mockDetail} />);
    expect(screen.getByRole("heading", { level: 1, name: mockDetail.title })).toBeInTheDocument();
  });

  it("版番号と日本時間の掲載日を表示する", () => {
    render(<DigestDetail article={mockDetail} />);
    expect(screen.getByText("1.9.0")).toBeInTheDocument();
    expect(screen.getByText("2026年4月10日（金）")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("版番号がない記事は「号外」として扱う", () => {
    render(<DigestDetail article={{ ...mockDetail, originalVersion: null }} />);
    expect(screen.getByText("号外")).toBeInTheDocument();
  });

  it("要点を囲み記事の番号付きリストで並べる", () => {
    render(<DigestDetail article={mockDetail} />);
    const box = screen.getByRole("region", { name: "要点" });
    const items = within(box).getAllByRole("listitem");
    expect(items).toHaveLength(mockDetail.keyPoints.length);
    expect(within(box).getByRole("list").tagName).toBe("OL");
  });

  it("末尾に出典欄を設け、公式変更ログへリンクする", () => {
    render(<DigestDetail article={mockDetail} />);
    const source = screen.getByRole("region", { name: "出典" });
    const link = within(source).getByRole("link", { name: /公式変更ログ/ });
    expect(link).toHaveAttribute("href", mockDetail.sourceUrl);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
