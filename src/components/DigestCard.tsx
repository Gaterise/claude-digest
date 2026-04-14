import Link from "next/link";
import type { DigestArticleSummary } from "@/generated/api/claudeDigestAPI";
import { CategoryBadge } from "./CategoryBadge";

interface DigestCardProps {
  article: DigestArticleSummary;
}

export function DigestCard({ article }: DigestCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleString(
    "ja-JP",
    { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
  );

  return (
    <div data-testid="digest-card" className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
      <Link href={`/digests/${article.id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
          {article.title}
        </h2>
      </Link>

      <ul className="mt-3 space-y-1">
        {article.keyPoints.slice(0, 3).map((point, i) => (
          <li key={i} className="flex items-start text-sm text-gray-600">
            <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {article.categories.map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
        <span className="ml-auto text-xs text-gray-400">{formattedDate}</span>
        {article.originalVersion && (
          <span className="text-xs text-gray-400">
            v{article.originalVersion}
          </span>
        )}
      </div>
    </div>
  );
}
