import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS } from "@/types";

/** 台帳の分類印（色付きの角印 + 文字） */
const CATEGORY_MARK: Record<DigestCategory, string> = {
  new_feature: "bg-shu",
  improvement: "bg-ai",
  bug_fix: "bg-ink-soft",
  deprecation: "bg-oudo",
  breaking_change: "bg-enji",
  other: "bg-ink-faint",
};

interface LedgerCategoryMarksProps {
  categories: DigestCategory[];
  className?: string;
  size?: "sm" | "md";
}

export function LedgerCategoryMarks({ categories, className = "", size = "sm" }: LedgerCategoryMarksProps) {
  if (categories.length === 0) return null;
  const text = size === "md" ? "text-xs" : "text-[11px]";
  const mark = size === "md" ? "h-2 w-2" : "h-1.5 w-1.5";

  return (
    <ul className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`} aria-label="分類">
      {categories.map((category) => (
        <li
          key={category}
          className={`inline-flex items-center gap-1.5 font-medium tracking-widest ${text} ${
            category === "breaking_change" ? "text-enji" : "text-ink-soft"
          }`}
        >
          <span aria-hidden="true" className={`${mark} ${CATEGORY_MARK[category] ?? "bg-ink-faint"}`} />
          <span>{CATEGORY_LABELS[category] ?? category}</span>
        </li>
      ))}
    </ul>
  );
}
