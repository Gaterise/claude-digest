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
      data-testid="digest-card"
      className="block rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
    >
      <div className="flex items-start gap-3">
        {/* 左カラム: バージョン・日時・NEWバッジ */}
        <div className="flex-shrink-0 w-36 pt-0.5">
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
          <span className="block text-xs text-gray-400 leading-tight whitespace-nowrap mt-0.5">
            {formattedDate}
          </span>
        </div>

        {/* 右カラム: タイトル・変更件数・カテゴリ */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 leading-snug">
            {article.title}
          </h2>

          {article.keyPoints.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {article.keyPoints.length} 件の変更
              </span>
            </div>
          )}

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
    </Link>
  );
}
