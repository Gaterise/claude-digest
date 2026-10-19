import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer コンポーネント", () => {
  it("「このサイトについて」欄に説明と情報元・更新・注意を分かりやすく記載する", () => {
    render(<Footer />);
    const about = screen.getByRole("region", { name: "このサイトについて" });
    expect(within(about).getByText(/日本語で要約/)).toBeInTheDocument();
    expect(within(about).getByText("情報元")).toBeInTheDocument();
    expect(within(about).getByText("Claude Code 公式リリース（GitHub）")).toBeInTheDocument();
    expect(within(about).getByText("更新")).toBeInTheDocument();
    expect(within(about).getByText("1時間ごとに自動チェック")).toBeInTheDocument();
    expect(within(about).getByText("注意")).toBeInTheDocument();
    expect(within(about).getByText("Anthropic の非公式サイトです")).toBeInTheDocument();
    expect(screen.queryByText("奥付")).not.toBeInTheDocument();
  });

  it("サイト内のページへのリンクを並べる", () => {
    render(<Footer />);
    const expected: Record<string, string> = {
      このサイトについて: "/about",
      "Claude モデル比較": "/models",
      "話題の AI 比較": "/ai-models",
      プライバシーポリシー: "/privacy",
      利用規約: "/terms",
      お問い合わせ: "/contact",
    };
    for (const [name, href] of Object.entries(expected)) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("外部リンクは別タブで開く", () => {
    render(<Footer />);
    for (const name of [/公式リリースノート/, /Anthropic 公式サイト/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("著作権表示を出す", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Claude Digest`))).toBeInTheDocument();
  });

  it("意味の伝わりにくい「了」の飾りを表示しない", () => {
    render(<Footer />);
    expect(screen.queryByText(/了/)).not.toBeInTheDocument();
  });
});
