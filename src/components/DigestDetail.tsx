import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { DigestArticleDetail } from "@/generated/api/claudeDigestAPI";
import { CategoryBadge } from "./CategoryBadge";

interface DigestDetailProps {
  article: DigestArticleDetail;
}

export function DigestDetail({ article }: DigestDetailProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "ja-JP",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {article.categories.map((category) => (
            <CategoryBadge key={category} category={category} />
          ))}
        </div>

        <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <time dateTime={article.publishedAt} className="inline-flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            {formattedDate}
          </time>
          {article.originalVersion && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-600">
              v{article.originalVersion}
            </span>
          )}
        </div>
      </header>

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {/* 重要ポイント */}
        <section className="mb-8 rounded-lg border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-blue-900">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            重要ポイント
          </h2>
          <ul className="space-y-3">
            {article.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed text-blue-950 sm:text-base"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* 要約本文（Markdown） */}
        <section className="prose prose-gray max-w-none prose-headings:scroll-mt-16 prose-h2:mt-10 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.summary}
          </ReactMarkdown>
        </section>

        {/* 公式リンク */}
        <footer className="mt-10 border-t border-gray-100 pt-6">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            公式変更ログを見る
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </footer>
      </div>
    </article>
  );
}
