import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DigestList } from "@/components/DigestList";

const mockArticles = [
  {
    id: "1",
    title: "テスト記事1",
    keyPoints: ["ポイント1"],
    categories: ["new_feature" as const],
    sourceUrl: "https://example.com",
    publishedAt: "2026-04-10T00:00:00.000Z",
    createdAt: "2026-04-10T01:00:00.000Z",
    originalVersion: null,
  },
  {
    id: "2",
    title: "テスト記事2",
    keyPoints: ["ポイント2"],
    categories: ["bug_fix" as const],
    sourceUrl: "https://example.com",
    publishedAt: "2026-04-09T00:00:00.000Z",
    createdAt: "2026-04-09T01:00:00.000Z",
    originalVersion: null,
  },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("DigestList コンポーネント", () => {
  it("カテゴリフィルタ UI を表示する", () => {
    renderWithProviders(<DigestList initialArticles={mockArticles} />);
    expect(screen.getByText("すべて")).toBeInTheDocument();
    // 「新機能」はフィルタボタンとカードバッジの両方に表示されるため getAllByText を使用
    expect(screen.getAllByText("新機能").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("category-filter")).toBeInTheDocument();
  });

  it("初期データとして記事一覧を表示する", () => {
    renderWithProviders(<DigestList initialArticles={mockArticles} />);
    expect(screen.getByText("テスト記事1")).toBeInTheDocument();
    expect(screen.getByText("テスト記事2")).toBeInTheDocument();
  });
});
