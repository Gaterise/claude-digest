import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModelComparisonTabs } from "@/components/models/ModelComparisonTabs";

const panels = {
  claude: <p>Claude パネル</p>,
  benchmarks: <p>ベンチマークパネル</p>,
  trending: <p>話題モデルパネル</p>,
};

function renderTabs(initialTab: "claude" | "benchmarks" | "trending" = "claude") {
  return render(
    <ModelComparisonTabs initialTab={initialTab} panels={panels} counts={{ benchmarks: 5, trending: 4 }} />
  );
}

describe("ModelComparisonTabs コンポーネント", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/models");
  });

  it("3つのタブを tablist として表示する", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual([
      expect.stringContaining("Claude モデル"),
      expect.stringContaining("ベンチマーク比較"),
      expect.stringContaining("話題の AI モデル"),
    ]);
  });

  it("件数バッジを表示する", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: /ベンチマーク比較/ })).toHaveTextContent("5");
    expect(screen.getByRole("tab", { name: /話題の AI モデル/ })).toHaveTextContent("4");
  });

  it("初期タブが選択され、そのパネルのみ表示される", () => {
    renderTabs("benchmarks");
    expect(screen.getByRole("tab", { name: /ベンチマーク比較/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Claude モデル/ })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("ベンチマークパネル")).toBeVisible();
    expect(screen.getByText("Claude パネル")).not.toBeVisible();
  });

  it("タブとパネルが aria-controls / aria-labelledby で関連付けられている", () => {
    renderTabs();
    const tab = screen.getByRole("tab", { name: /Claude モデル/ });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("選択中のタブのみ tabIndex=0（roving tabindex）", () => {
    renderTabs();
    const [claude, bench, trend] = screen.getAllByRole("tab");
    expect(claude).toHaveAttribute("tabindex", "0");
    expect(bench).toHaveAttribute("tabindex", "-1");
    expect(trend).toHaveAttribute("tabindex", "-1");
  });

  it("クリックで切り替わり、URL の tab パラメータが更新される", () => {
    renderTabs();
    fireEvent.click(screen.getByRole("tab", { name: /話題の AI モデル/ }));

    expect(screen.getByRole("tab", { name: /話題の AI モデル/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("話題モデルパネル")).toBeVisible();
    expect(screen.getByText("Claude パネル")).not.toBeVisible();
    expect(window.location.search).toBe("?tab=trending");
  });

  it("既定タブに戻すと tab パラメータが削除される", () => {
    renderTabs("benchmarks");
    window.history.replaceState(null, "", "/models?tab=benchmarks");
    fireEvent.click(screen.getByRole("tab", { name: /Claude モデル/ }));
    expect(window.location.search).toBe("");
  });

  it("→ / ← キーで隣のタブへ移動し（端で循環）、フォーカスも移る", () => {
    renderTabs();
    const claude = screen.getByRole("tab", { name: /Claude モデル/ });
    claude.focus();

    fireEvent.keyDown(claude, { key: "ArrowRight" });
    const bench = screen.getByRole("tab", { name: /ベンチマーク比較/ });
    expect(bench).toHaveAttribute("aria-selected", "true");
    expect(bench).toHaveFocus();

    fireEvent.keyDown(bench, { key: "ArrowLeft" });
    fireEvent.keyDown(claude, { key: "ArrowLeft" });
    const trend = screen.getByRole("tab", { name: /話題の AI モデル/ });
    expect(trend).toHaveAttribute("aria-selected", "true");
    expect(trend).toHaveFocus();
  });

  it("Home / End キーで先頭・末尾のタブへ移動する", () => {
    renderTabs("benchmarks");
    const bench = screen.getByRole("tab", { name: /ベンチマーク比較/ });

    fireEvent.keyDown(bench, { key: "End" });
    expect(screen.getByRole("tab", { name: /話題の AI モデル/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(screen.getByRole("tab", { name: /話題の AI モデル/ }), { key: "Home" });
    expect(screen.getByRole("tab", { name: /Claude モデル/ })).toHaveAttribute("aria-selected", "true");
  });
});
