import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendsSidebar } from "@/components/TrendsSidebar";
import * as api from "@/generated/api/claudeDigestAPI";

vi.mock("@/generated/api/claudeDigestAPI", () => ({
  useGetTrends: vi.fn(),
}));

const useGetTrends = vi.mocked(api.useGetTrends);

const mockTrends = {
  items: [
    {
      title: "GPT-6のマルチエージェント機能が話題",
      summary: "複数エージェントの協調動作が可能になり開発者の注目を集めている。",
      keyword: "GPT-6",
    },
    {
      title: "Claude Codeの新スキル機能",
      summary: "スキルの共有機能が追加され活用事例が多数投稿されている。",
      keyword: "Claude Code スキル",
    },
  ],
  generatedAt: "2026-07-03T00:00:00.000Z",
};

type UseGetTrendsResult = ReturnType<typeof api.useGetTrends>;

function mockQueryResult(partial: Partial<UseGetTrendsResult>) {
  useGetTrends.mockReturnValue({
    data: undefined,
    isLoading: false,
    ...partial,
  } as UseGetTrendsResult);
}

describe("TrendsSidebar コンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("トレンド一覧を表示する", () => {
    mockQueryResult({ data: mockTrends });
    render(<TrendsSidebar />);

    expect(
      screen.getByText("GPT-6のマルチエージェント機能が話題")
    ).toBeInTheDocument();
    expect(screen.getByText("Claude Codeの新スキル機能")).toBeInTheDocument();
    expect(screen.getAllByTestId("trend-item")).toHaveLength(2);
  });

  it("各トレンドに X / Threads の検索リンクを表示する", () => {
    mockQueryResult({ data: mockTrends });
    render(<TrendsSidebar />);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("https://x.com/search?q=GPT-6&f=live");
    expect(hrefs).toContain("https://www.threads.com/search?q=GPT-6");
    // 外部リンクは新しいタブで開く
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("ローディング中はスケルトンを表示する", () => {
    mockQueryResult({ isLoading: true });
    const { container } = render(<TrendsSidebar />);

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    expect(screen.queryByText("トレンド情報を準備中です")).not.toBeInTheDocument();
  });

  it("トレンド未生成の場合は準備中メッセージを表示する", () => {
    mockQueryResult({ data: { items: [], generatedAt: null } });
    render(<TrendsSidebar />);

    expect(screen.getByText("トレンド情報を準備中です")).toBeInTheDocument();
  });

  it("取得エラーの場合も準備中メッセージを表示する", () => {
    mockQueryResult({ data: undefined });
    render(<TrendsSidebar />);

    expect(screen.getByText("トレンド情報を準備中です")).toBeInTheDocument();
  });
});