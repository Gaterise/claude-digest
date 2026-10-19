import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/Header";

describe("Header コンポーネント", () => {
  it("題字（Claude Digest）からトップへ戻れる", () => {
    render(<Header />);
    const home = screen.getByRole("link", { name: /Claude Digest/ });
    expect(home).toHaveAttribute("href", "/");
  });

  it("紙面の題字として誌名の副題を添える", () => {
    render(<Header />);
    expect(screen.getByText("Claude Code 変更ログの日本語版")).toBeInTheDocument();
  });

  it("メニューを開くと各ページへのリンクが並ぶ", () => {
    render(<Header />);
    const button = screen.getByRole("button", { name: "メニューを開く" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Claude モデル比較" })).toHaveAttribute("href", "/models");
    expect(screen.getByRole("link", { name: "話題の AI 比較" })).toHaveAttribute("href", "/ai-models");
    expect(screen.getByRole("link", { name: "このサイトについて" })).toHaveAttribute("href", "/about");
    const official = screen.getByRole("link", { name: /公式リリース/ });
    expect(official).toHaveAttribute("target", "_blank");
    expect(official).toHaveAttribute("rel", "noopener noreferrer");
  });
});
