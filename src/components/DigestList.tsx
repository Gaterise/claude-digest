"use client";

import { useState, useCallback, type ReactNode } from "react";
import type {
  DigestArticleSummary,
  DigestCategory,
} from "@/generated/api/claudeDigestAPI";
import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestCard } from "./DigestCard";
import { CategoryFilter } from "./CategoryFilter";
import { Loading } from "./ui/Loading";
import { groupByJstDate } from "@/lib/digestLedger";

const PAGE_SIZE = 30;

interface DigestListProps {
  initialArticles: DigestArticleSummary[];
  initialNextCursor: string | null;
}

export function DigestList({ initialArticles, initialNextCursor }: DigestListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<DigestCategory | null>(null);

  // 表示中の記事リスト
  const [articles, setArticles] = useState<DigestArticleSummary[]>(initialArticles);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // カテゴリ変更時は先頭から取り直す
  const handleCategoryChange = useCallback(async (category: DigestCategory | null) => {
    setSelectedCategory(category);
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await listDigests({
        limit: PAGE_SIZE,
        ...(category ? { category } : {}),
      });
      setArticles(result.items);
      setNextCursor(result.nextCursor ?? null);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // もっと見る
  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await listDigests({
        limit: PAGE_SIZE,
        cursor: nextCursor,
        ...(selectedCategory ? { category: selectedCategory } : {}),
      });
      setArticles((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor ?? null);
    } catch {
      // 失敗しても既存記事は維持
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, selectedCategory]);

  const groups = groupByJstDate(articles);

  return (
    <div>
      <div className="mb-8">
        <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <LedgerNotice
          title="記録を取り寄せられませんでした"
          body="しばらく経ってから、もう一度お試しください。"
        />
      ) : articles.length === 0 ? (
        <LedgerNotice
          title={selectedCategory ? "該当するダイジェストがありません" : "まだダイジェストがありません"}
          body={selectedCategory ? "分類を変えるか、絞り込みを解除してください。" : "公式リリースが出しだい、ここに記録されます。"}
          action={
            selectedCategory ? (
              <button
                type="button"
                onClick={() => handleCategoryChange(null)}
                className="mt-4 font-mincho text-sm text-shu underline decoration-1 underline-offset-4 hover:text-ink"
              >
                フィルタを解除する
              </button>
            ) : null
          }
        />
      ) : (
        <div>
          <div className="space-y-10 sm:space-y-12">
            {groups.map((group, index) => (
              <section
                key={group.date.key}
                aria-labelledby={`ledger-date-${group.date.key}`}
                className="grid border-t-2 border-ink motion-safe:animate-ledger-rise sm:grid-cols-[7.5rem_minmax(0,1fr)]"
                style={{ animationDelay: `${Math.min(index, 6) * 80}ms` }}
              >
                <h2
                  id={`ledger-date-${group.date.key}`}
                  className="flex items-end gap-3 border-b border-rule/80 py-3 sm:sticky sm:top-20 sm:block sm:self-start sm:border-b-0 sm:py-4"
                >
                  <span className="sr-only">{group.date.label}</span>
                  <span aria-hidden="true" className="font-numeral text-5xl font-medium leading-[0.85] text-ink sm:text-[4.25rem]">
                    {group.date.day}
                  </span>
                  <span aria-hidden="true" className="block pb-0.5 sm:mt-2 sm:pb-0">
                    <span className="block font-mincho text-sm font-bold text-ink">
                      {group.date.month}月 <span className="text-shu">{group.date.weekday}</span>曜
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                      {group.date.year}
                    </span>
                  </span>
                </h2>
                <div className="sm:border-l sm:border-rule/80">
                  {group.items.map((article) => (
                    <DigestCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {nextCursor && (
            <div className="mt-12 flex items-center gap-4">
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="font-mincho text-sm font-bold tracking-wider text-ink transition-colors hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shu disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? "読み込み中…" : "もっと見る ── さらに過去の記録"}
              </button>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LedgerNotice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-y-[3px] border-double border-ink px-4 py-12 text-center">
      <p className="font-mincho text-lg font-bold text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink-soft">{body}</p>
      {action}
    </div>
  );
}
