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

  const isNew =
    Date.now() - new Date(article.publishedAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/digests/${article.id}`}
      prefetch={false}
      data-testid="digest-card"
      className="block rounded-lg border border-gray-200 bg-white px-3 py-3 sm:px-4 transition-all hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        {/* 上部(モバイル) / 左カラム(PC): バージョン・日時・NEWバッジ */}
        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start sm:flex-shrink-0 sm:w-36 sm:pt-0.5 gap-2 sm:gap-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.originalVersion && (
              <span className="text-sm font-mono font-semibold text-blue-600">
                v{article.originalVersion}
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white leading-none">
                NEW
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 leading-tight whitespace-nowrap sm:mt-0.5">
            {formattedDate}
          </span>
        </div>

        {/* 右カラム: タイトル・変更件数・ポイント・カテゴリ */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">
            {article.title}
          </h2>

          {article.keyPoints.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {article.keyPoints.length} 件の重要な変更
              </span>
            </div>
          )}

          {article.keyPoints.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {article.keyPoints.slice(0, 3).map((point, i) => (
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
    </Link>
  );
}
