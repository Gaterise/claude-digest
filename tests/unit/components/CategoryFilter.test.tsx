import { CATEGORY_TONE } from "@/lib/categoryTone";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilter } from "@/components/CategoryFilter";

describe("CategoryFilter コンポーネント", () => {
  const allCategories = [
    "new_feature", "improvement", "bug_fix",
    "deprecation", "breaking_change", "other",
  ] as const;

  it("全カテゴリのボタンを表示する", () => {
    render(<CategoryFilter selected={null} onSelect={() => {}} />);
    expect(screen.getByText("新機能")).toBeInTheDocument();
    expect(screen.getByText("改善")).toBeInTheDocument();
    expect(screen.getByText("バグ修正")).toBeInTheDocument();
    expect(screen.getByText("すべて")).toBeInTheDocument();
  });

  it("カテゴリ選択時に onSelect コールバックが呼ばれる", () => {
    const onSelect = vi.fn();
    render(<CategoryFilter selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("新機能"));
    expect(onSelect).toHaveBeenCalledWith("new_feature");
  });

  it("選択中のカテゴリがハイライトされる", () => {
    render(<CategoryFilter selected="bug_fix" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /バグ修正/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /すべて/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("「すべて」をクリックすると null が渡される", () => {
    const onSelect = vi.fn();
    render(<CategoryFilter selected="new_feature" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("すべて"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("選択中の分類は、その分類の色で塗りつぶす", () => {
    render(<CategoryFilter selected="bug_fix" onSelect={() => {}} />);
    const solid = CATEGORY_TONE.bug_fix.solid.split(" ");
    expect(screen.getByRole("button", { name: /バグ修正/ })).toHaveClass(...solid);
    expect(screen.getByRole("button", { name: /新機能/ })).not.toHaveClass(...CATEGORY_TONE.new_feature.solid.split(" "));
  });

  it("未選択の分類も色付きの札として表示する", () => {
    render(<CategoryFilter selected={null} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /新機能/ })).toHaveClass(...CATEGORY_TONE.new_feature.tag.split(" "));
  });
});
