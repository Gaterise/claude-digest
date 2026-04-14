import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
  description:
    "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
