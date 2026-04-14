import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
  description:
    "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
    description:
      "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
    url: "https://claude-digest.web.app",
    siteName: "Claude Digest",
    images: [
      {
        url: "https://claude-digest.web.app/ogp.png",
        width: 1200,
        height: 630,
        alt: "Claude Digest",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
    description:
      "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
    images: ["/ogp.png"],
  },
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
