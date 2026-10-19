import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer コンポーネント（奥付）", () => {
  it("奥付として誌名・内容・出典・更新・備考を記載する", () => {
    render(<Footer />);
    const colophon = screen.getByRole("region", { name: "奥付" });
    for (const term of ["誌名", "内容", "出典", "更新", "備考"]) {
      expect(within(colophon).getByText(term)).toBeInTheDocument();
    }
    expect(within(colophon).getByText(/Anthropic の非公式サービス/)).toBeInTheDocument();
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
});
