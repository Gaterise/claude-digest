"use client";

import { useState, useCallback } from "react";
import type {
  DigestArticleSummary,
  DigestCategory,
} from "@/generated/api/claudeDigestAPI";
import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestCard } from "./DigestCard";
import { CategoryFilter } from "./CategoryFilter";
import { Loading } from "./ui/Loading";

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

  return (
    <div>
      {/* カテゴリフィルタ */}
      <div className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* 記事一覧 */}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">データの取得に失敗しました</p>
          <p className="mt-1 text-sm text-red-400">
            しばらく経ってから再度お試しください
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {selectedCategory
              ? "該当するダイジェストがありません"
              : "まだダイジェストがありません"}
          </p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              フィルタを解除する
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {articles.map((article) => (
              <DigestCard key={article.id} article={article} />
            ))}
          </div>

          {/* もっと見るボタン */}
          {nextCursor && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                {isLoadingMore ? "読み込み中..." : "もっと見る"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
