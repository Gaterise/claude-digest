import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS } from "@/types";
import { CATEGORY_TONE } from "@/lib/categoryTone";

interface LedgerCategoryMarksProps {
  categories: DigestCategory[];
  className?: string;
  size?: "sm" | "md";
}

/** 分類の札（薄い色の背景 + 左の色線 + 文字） */
export function LedgerCategoryMarks({ categories, className = "", size = "sm" }: LedgerCategoryMarksProps) {
  if (categories.length === 0) return null;
  const sizeClass = size === "md" ? "px-2.5 py-1 text-[13px]" : "px-2 py-0.5 text-xs";

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="分類">
      {categories.map((category) => (
        <li
          key={category}
          className={`border-l-[3px] font-bold tracking-wider ${sizeClass} ${CATEGORY_TONE[category]?.tag ?? CATEGORY_TONE.other.tag}`}
        >
          {CATEGORY_LABELS[category] ?? category}
        </li>
      ))}
    </ul>
  );
}
