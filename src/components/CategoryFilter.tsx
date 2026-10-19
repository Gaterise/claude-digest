"use client";

import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS } from "@/types";
import { CATEGORY_TONE, type CategoryTone } from "@/lib/categoryTone";

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
  tone,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: CategoryTone;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex-shrink-0 border-l-[3px] px-3 py-1.5 text-[13px] font-bold tracking-wider transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu sm:text-sm ${
        active ? `${tone.solid} shadow-[2px_2px_0_0_var(--color-ink)]` : `${tone.tag} hover:brightness-95`
      }`}
    >
      {label}
    </button>
  );
}

const ALL_TONE: CategoryTone = {
  tag: "border-ink bg-paper-deep text-ink",
  solid: "border-ink bg-ink text-paper",
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-start gap-3 border-b border-rule pb-3">
      <span className="shrink-0 pt-2 font-mincho text-xs font-bold tracking-[0.2em] text-ink-soft">分類</span>
      <div
        data-testid="category-filter"
        className="flex flex-wrap gap-2 pr-1"
      >
        <FilterButton label="すべて" active={selected === null} tone={ALL_TONE} onClick={() => onSelect(null)} />
        {FILTER_CATEGORIES.map((cat) => (
          <FilterButton
            key={cat}
            label={CATEGORY_LABELS[cat] ?? cat}
            active={selected === cat}
            tone={CATEGORY_TONE[cat]}
            onClick={() => onSelect(cat)}
          />
        ))}
      </div>
    </div>
  );
}
