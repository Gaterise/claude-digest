import Link from "next/link";
import type { DigestArticleSummary } from "@/generated/api/claudeDigestAPI";
import { LedgerCategoryMarks } from "./LedgerCategoryMarks";
import { formatJstTime, getJstDateParts, isNewArticle } from "@/lib/digestLedger";

interface DigestCardProps {
  article: DigestArticleSummary;
}

export function DigestCard({ article }: DigestCardProps) {
  const isNew = isNewArticle(article.publishedAt);
  const date = getJstDateParts(article.publishedAt);

  return (
    <article
      data-testid="digest-card"
      className="group relative border-b border-rule/80 py-5 transition-colors last:border-b-0 hover:bg-paper-deep/40 sm:px-3"
    >
      <div className="min-w-0 pr-16 sm:pr-20">
        {/* 1行目: 版数と時刻 */}
        <p data-testid="digest-meta" className="flex items-baseline gap-2.5 whitespace-nowrap leading-none">
          {article.originalVersion ? (
            <span className="font-numeral text-ink">
              <span className="mr-0.5 text-xs italic text-ink-faint">v</span>
              <span className="text-xl font-semibold tracking-tight tabular-nums sm:text-[1.4rem]">
                {article.originalVersion}
              </span>
            </span>
          ) : (
            <span className="font-mincho text-base font-bold text-ink">号外</span>
          )}
          <span aria-hidden="true" className="text-ink-faint">·</span>
          <time dateTime={article.publishedAt} className="font-mono text-xs tracking-wider text-ink-faint">
            <span className="sr-only">{date.label} </span>
            {formatJstTime(article.publishedAt)}
          </time>
        </p>

        {/* 2行目: 分類 */}
        <LedgerCategoryMarks categories={article.categories} className="mt-2.5" />

        <h3 className="mt-2 font-mincho text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
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
          className="pointer-events-none absolute right-0 top-3 flex h-14 w-14 items-center justify-center rounded-full bg-shu font-mincho text-sm font-extrabold leading-none tracking-wider text-paper shadow-[0_2px_6px_rgb(194_58_34/0.35)] outline outline-1 -outline-offset-4 outline-paper/70 motion-safe:animate-stamp sm:right-2"
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
