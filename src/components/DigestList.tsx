"use client";

import { useState } from "react";
import type {
  DigestArticleSummary,
  DigestCategory,
} from "@/generated/api/claudeDigestAPI";
import { useListDigests } from "@/generated/api/claudeDigestAPI";
import { DigestCard } from "./DigestCard";
import { CategoryFilter } from "./CategoryFilter";
import { Loading } from "./ui/Loading";

interface DigestListProps {
  initialArticles: DigestArticleSummary[];
}

export function DigestList({ initialArticles }: DigestListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<DigestCategory | null>(null);

  // クライアントサイドでフィルタリング（TanStack Query hooks）
  const { data, isLoading, isError } = useListDigests(
    selectedCategory ? { category: selectedCategory } : undefined,
    {
      // SSR で取得した初期データを使用
      initialData: selectedCategory
        ? undefined
        : { items: initialArticles, total: initialArticles.length, nextCursor: null },
    }
  );

  const articles = data?.items ?? initialArticles;

  return (
    <div>
      {/* カテゴリフィルタ */}
      <div className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
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
              onClick={() => setSelectedCategory(null)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              フィルタを解除する
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-2 text-sm text-gray-500">
            {articles.length} 件の変更ログ
          </p>
          <div className="space-y-2">
            {articles.map((article) => (
              <DigestCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
