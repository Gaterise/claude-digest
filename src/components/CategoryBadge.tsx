import type { DigestCategory } from "@/generated/api/claudeDigestAPI";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";

interface CategoryBadgeProps {
  category: DigestCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const colorClass = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
