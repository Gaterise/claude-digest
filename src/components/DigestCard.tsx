import Link from "next/link";
import type { DigestArticleSummary, DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS } from "@/types";
import { formatJstTime, getJstDateParts, isNewArticle } from "@/lib/digestLedger";

interface DigestCardProps {
  article: DigestArticleSummary;
}

/** 台帳の分類印（色付きの角印 + 文字） */
const CATEGORY_MARK: Record<DigestCategory, string> = {
  new_feature: "bg-shu",
  improvement: "bg-ai",
  bug_fix: "bg-ink-soft",
  deprecation: "bg-oudo",
  breaking_change: "bg-enji",
  other: "bg-ink-faint",
};

export function DigestCard({ article }: DigestCardProps) {
  const isNew = isNewArticle(article.publishedAt);
  const date = getJstDateParts(article.publishedAt);

  return (
    <article
      data-testid="digest-card"
      className="group relative grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-4 border-b border-rule/80 py-5 transition-colors last:border-b-0 hover:bg-paper-deep/40 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6 sm:px-3"
    >
      {/* 版数と時刻 */}
      <div className="pt-0.5">
        {article.originalVersion ? (
          <p className="font-numeral leading-none text-ink">
            <span className="mr-0.5 align-top text-[11px] italic text-ink-faint">v</span>
            <span className="text-[1.35rem] font-semibold tracking-tight tabular-nums sm:text-[1.7rem]">
              {article.originalVersion}
            </span>
          </p>
        ) : (
          <p className="font-mincho text-lg font-bold leading-none text-ink">号外</p>
        )}
        <time
          dateTime={article.publishedAt}
          className="mt-2 block font-mono text-[11px] tracking-wider text-ink-faint"
        >
          <span className="sr-only">{date.label} </span>
          {formatJstTime(article.publishedAt)}
        </time>
      </div>

      {/* 本文 */}
      <div className="min-w-0 pr-10 sm:pr-14">
        {article.categories.length > 0 && (
          <ul className="mb-1.5 flex flex-wrap gap-x-3 gap-y-1" aria-label="分類">
            {article.categories.map((category) => (
              <li
                key={category}
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium tracking-widest ${
                  category === "breaking_change" ? "text-enji" : "text-ink-soft"
                }`}
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 ${CATEGORY_MARK[category] ?? "bg-ink-faint"}`} />
                <span>{CATEGORY_LABELS[category] ?? category}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-mincho text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
          <Link
            href={`/digests/${article.id}`}
            prefetch={false}
            className="ledger-underline outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-shu"
          >
            {article.title}
          </Link>
        </h3>

        {article.keyPoints.length > 0 && (
          <ol className="mt-2.5 space-y-1 border-l border-rule pl-3">
            {article.keyPoints.slice(0, 3).map((point, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span aria-hidden="true" className="font-numeral text-xs italic text-shu">
                  {i + 1}.
                </span>
                <span className="line-clamp-2 sm:line-clamp-1">{point}</span>
              </li>
            ))}
          </ol>
        )}

        {article.keyPoints.length > 3 && (
          <p className="mt-1.5 pl-3 text-[11px] text-ink-faint">ほか {article.keyPoints.length - 3} 件の変更</p>
        )}
      </div>

      {/* 新着印 */}
      {isNew && (
        <span
          className="pointer-events-none absolute right-1 top-4 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-shu font-mincho text-[11px] font-extrabold leading-none text-shu motion-safe:animate-stamp sm:right-3"
          style={{ transform: "rotate(-8deg)" }}
        >
          新着
        </span>
      )}

      {/* 読む導線 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-1 font-mincho text-xs text-shu opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:right-3 sm:-translate-x-1"
      >
        読む →
      </span>
    </article>
  );
}
