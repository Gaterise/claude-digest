import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
