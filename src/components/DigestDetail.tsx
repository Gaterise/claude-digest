import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { DigestArticleDetail } from "@/generated/api/claudeDigestAPI";
import { formatJstTime, getJstDateParts } from "@/lib/digestLedger";
import { LedgerCategoryMarks } from "./LedgerCategoryMarks";

interface DigestDetailProps {
  article: DigestArticleDetail;
}

const PROSE_CLASS = [
  "prose max-w-none text-[15px] leading-[1.95] text-ink/90 sm:text-base",
  "prose-headings:scroll-mt-20 prose-headings:font-mincho prose-headings:font-bold prose-headings:text-ink",
  "prose-h2:mt-12 prose-h2:border-b prose-h2:border-ink prose-h2:pb-2 prose-h2:text-xl prose-h2:tracking-[0.04em]",
  "prose-h3:mt-8 prose-h3:text-lg",
  "prose-p:text-ink/90 prose-strong:text-ink prose-li:my-1 prose-li:marker:text-shu",
  "prose-a:text-shu prose-a:decoration-shu/40 prose-a:underline-offset-4 hover:prose-a:decoration-shu",
  "prose-blockquote:border-l-shu prose-blockquote:font-mincho prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-ink-soft [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none",
  "prose-hr:border-rule",
  "prose-code:rounded-none prose-code:bg-paper-deep prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-normal prose-code:text-ink prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-none prose-pre:border prose-pre:border-ink prose-pre:bg-ink prose-pre:text-paper [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-paper",
  "prose-th:border-b prose-th:border-ink prose-th:font-mincho prose-th:text-ink prose-td:border-rule",
].join(" ");

export function DigestDetail({ article }: DigestDetailProps) {
  const date = getJstDateParts(article.publishedAt);

  return (
    <article className="mx-auto max-w-3xl text-ink">
      {/* 見出し */}
      <header className="motion-safe:animate-ledger-rise">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink pb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          <span>Claude Code Release Ledger</span>
          <span className="normal-case tracking-[0.15em]">Release Note</span>
        </div>

        <div className="grid gap-x-8 gap-y-5 py-7 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:py-9">
          {/* 版数と掲載日時 */}
          <div className="flex items-end justify-between gap-4 border-b border-rule pb-4 sm:block sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">Version</p>
              {article.originalVersion ? (
                <p className="mt-1 font-numeral leading-none">
                  <span className="mr-0.5 align-top text-sm italic text-ink-faint">v</span>
                  <span className="text-[2.6rem] font-semibold tracking-tight tabular-nums sm:text-5xl">
                    {article.originalVersion}
                  </span>
                </p>
              ) : (
                <p className="mt-1 font-mincho text-4xl font-extrabold leading-none text-shu">号外</p>
              )}
            </div>
            <time
              dateTime={article.publishedAt}
              className="block text-right sm:mt-5 sm:text-left"
            >
              <span className="sr-only">{date.label}</span>
              <span aria-hidden="true" className="block font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                {date.year}
              </span>
              <span aria-hidden="true" className="block whitespace-nowrap font-mincho text-[15px] text-ink">
                {date.month}月{date.day}日<span className="text-shu">（{date.weekday}）</span>
              </span>
              <span className="mt-1 block font-mono text-[11px] tracking-wider text-ink-faint">
                {formatJstTime(article.publishedAt)}
              </span>
            </time>
          </div>

          <div className="min-w-0">
            <LedgerCategoryMarks categories={article.categories} size="md" className="mb-3" />
            <h1 className="font-mincho text-[1.7rem] font-extrabold leading-[1.45] tracking-[0.02em] text-ink sm:text-[2.2rem]">
              {article.title}
            </h1>
          </div>
        </div>
        <div aria-hidden="true" className="h-[5px] border-y border-ink" />
      </header>

      {/* 要点（囲み記事） */}
      <section
        aria-labelledby="digest-keypoints"
        className="relative mt-9 border-[3px] border-double border-ink bg-paper-deep/50 px-5 pb-5 pt-7 motion-safe:animate-ledger-rise sm:px-7 [animation-delay:120ms]"
      >
        <div className="absolute -top-3 left-4 flex items-center gap-2 bg-paper px-2 sm:left-6">
          <h2 id="digest-keypoints" className="font-mincho text-base font-bold tracking-[0.4em] text-ink">
            要点
          </h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
            {article.keyPoints.length} POINTS
          </span>
        </div>
        <ol className="space-y-3">
          {article.keyPoints.map((point, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-2">
              <span aria-hidden="true" className="font-numeral text-xl italic leading-none text-shu">
                {i + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-ink">{point}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 本文 */}
      <div className={`mt-10 ${PROSE_CLASS}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.summary}</ReactMarkdown>
      </div>

      <p aria-hidden="true" className="mt-10 text-right font-mincho text-sm tracking-[0.3em] text-ink-faint">
        （了）
      </p>

      {/* 出典 */}
      <section aria-labelledby="digest-source" className="mt-6 border-t-2 border-ink pt-4">
        <div className="grid gap-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
          <h2 id="digest-source" className="font-mincho text-sm font-bold tracking-[0.4em] text-ink">
            出典
          </h2>
          <div className="min-w-0">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              本記事は Claude Code の公式リリースノートを AI で日本語に要約したものです。正確な内容は原文をご確認ください。
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-baseline gap-2 font-mincho text-[15px] font-bold text-shu"
            >
              <span className="ledger-underline">公式変更ログを見る</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
            <p className="mt-1 truncate font-mono text-[11px] text-ink-faint">{article.sourceUrl}</p>
          </div>
        </div>
      </section>
    </article>
  );
}
