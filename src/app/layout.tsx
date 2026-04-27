import type { Metadata } from "next";
import Script from "next/script";
import { QueryProvider } from "@/providers/QueryProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
  description:
    "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
  icons: {
    icon: "https://claude-digest.com/icon-192x192.png",
    apple: "https://claude-digest.com/icon-192x192.png",
  },
  openGraph: {
    title: "Claude Digest - Claude 変更ログ日本語ダイジェスト",
    description:
      "Claude の公式変更ログを日本語に要約し、重要なポイントをわかりやすくまとめたダイジェスト記事を提供します。",
    url: "https://claude-digest.com",
    siteName: "Claude Digest",
    images: [
      {
        url: "https://claude-digest.com/ogp.png",
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
    images: ["https://claude-digest.com/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1962613767621328"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head> */}
      <body className="flex flex-col min-h-screen bg-gray-50">
        <QueryProvider>
          <AnalyticsProvider />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
