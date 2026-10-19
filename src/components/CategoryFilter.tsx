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

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative flex-shrink-0 px-1 py-1 font-mincho text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu sm:text-[15px] ${
        active ? "font-bold text-ink" : "text-ink-faint hover:text-ink"
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute inset-x-1 -bottom-px h-[3px] bg-shu transition-transform duration-300 origin-left ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-3 border-b border-rule pb-1">
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-shu" />
        分類
      </span>
      <div
        data-testid="category-filter"
        className="scrollbar-none flex gap-3 overflow-x-auto sm:flex-wrap sm:gap-x-4"
      >
        <FilterButton label="すべて" active={selected === null} onClick={() => onSelect(null)} />
        {FILTER_CATEGORIES.map((cat) => (
          <FilterButton
            key={cat}
            label={CATEGORY_LABELS[cat] ?? cat}
            active={selected === cat}
            onClick={() => onSelect(cat)}
          />
        ))}
      </div>
    </div>
  );
}
