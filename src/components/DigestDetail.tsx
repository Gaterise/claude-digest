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
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {article.categories.map((category) => (
            <CategoryBadge key={category} category={category} />
          ))}
          <span className="text-sm text-gray-500">{formattedDate}</span>
          {article.originalVersion && (
            <span className="text-sm text-gray-500">
              v{article.originalVersion}
            </span>
          )}
        </div>
      </header>

      {/* 重要ポイント */}
      <section className="mb-8 rounded-lg bg-blue-50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-blue-900">
          重要ポイント
        </h2>
        <ul className="space-y-2">
          {article.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start text-blue-800">
              <span className="mr-2 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* 要約本文（Markdown） */}
      <section className="prose prose-gray max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.summary}
        </ReactMarkdown>
      </section>

      {/* 公式リンク */}
      <footer className="mt-8 border-t border-gray-200 pt-6">
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          公式変更ログを見る →
        </a>
      </footer>
    </article>
  );
}
