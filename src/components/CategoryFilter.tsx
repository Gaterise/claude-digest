"use client";

import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS } from "@/types";

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
          className={`flex-shrink-0 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {CATEGORY_LABELS[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}
