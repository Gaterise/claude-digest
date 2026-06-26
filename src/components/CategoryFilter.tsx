"use client";

import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";

interface CategoryFilterProps {
  selected: DigestCategory | null;
  onSelect: (category: DigestCategory | null) => void;
}

const FILTER_CATEGORIES: DigestCategory[] = [
  "new_feature",
  "improvement",
  "bug_fix",
  "deprecation",
  "breaking_change",
  "other",
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        絞り込み
      </span>
      <div
        data-testid="category-filter"
        className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-none"
      >
        <button
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
            selected === null
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          すべて
        </button>
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              selected === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>
    </div>
  );
}
