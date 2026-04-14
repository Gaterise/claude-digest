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
    <div data-testid="category-filter" className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
