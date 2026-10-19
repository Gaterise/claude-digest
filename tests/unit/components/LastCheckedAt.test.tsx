import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseGetScrapeStatus = vi.fn();
vi.mock("@/generated/api/claudeDigestAPI", () => ({
  useGetScrapeStatus: () => mockUseGetScrapeStatus(),
}));

import { LastCheckedAt } from "@/components/LastCheckedAt";

describe("LastCheckedAt コンポーネント", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-19T09:40:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
    mockUseGetScrapeStatus.mockReset();
  });

  it("「最終チェック」と、今日なら時刻だけを短く表示する", () => {
    mockUseGetScrapeStatus.mockReturnValue({ data: { lastCheckedAt: "2026-10-19T09:35:00.000Z" }, isLoading: false });
    render(<LastCheckedAt />);
    expect(screen.getByText(/最終チェック/)).toBeInTheDocument();
    expect(screen.getByText("今日 18:35")).toBeInTheDocument();
    expect(screen.queryByText(/2026年10月19日/)).not.toBeInTheDocument();
  });

  it("<time> に機械可読な日時を持たせる", () => {
    mockUseGetScrapeStatus.mockReturnValue({ data: { lastCheckedAt: "2026-10-19T09:35:00.000Z" }, isLoading: false });
    render(<LastCheckedAt />);
    expect(screen.getByText("今日 18:35").closest("time")).toHaveAttribute("dateTime", "2026-10-19T09:35:00.000Z");
  });

  it("取得できない場合は ― を表示する", () => {
    mockUseGetScrapeStatus.mockReturnValue({ data: undefined, isLoading: false });
    render(<LastCheckedAt />);
    expect(screen.getByText("―")).toBeInTheDocument();
  });
});
