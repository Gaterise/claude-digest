import Link from "next/link";
import type { DigestArticleSummary } from "@/generated/api/claudeDigestAPI";
import { CategoryBadge } from "./CategoryBadge";

interface DigestCardProps {
  article: DigestArticleSummary;
}

export function DigestCard({ article }: DigestCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      data-testid="digest-card"
      className="rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-sm hover:border-gray-300"
    >
      <div className="flex items-start gap-3">
        {/* 左カラム: バージョン・日時 */}
        <div className="flex-shrink-0 w-32 pt-0.5">
          {article.originalVersion && (
            <span className="block text-sm font-mono font-semibold text-blue-600">
              v{article.originalVersion}
            </span>
          )}
          <span className="block text-xs text-gray-400 leading-tight whitespace-nowrap">
            {formattedDate}
          </span>
        </div>

        {/* 右カラム: タイトル・ポイント・カテゴリ */}
        <div className="flex-1 min-w-0">
          <Link href={`/digests/${article.id}`} className="block">
            <h2 className="text-sm font-semibold text-gray-900 hover:text-blue-600 leading-snug">
              {article.title}
            </h2>
          </Link>

          {article.keyPoints.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {article.keyPoints.slice(0, 2).map((point, i) => (
                <li key={i} className="flex items-start text-xs text-gray-500">
                  <span className="mr-1.5 mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-blue-300" />
                  <span className="line-clamp-1">{point}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-1.5 flex flex-wrap gap-1">
            {article.categories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
