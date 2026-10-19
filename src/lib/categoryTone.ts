import type { DigestCategory } from "@/generated/api/claudeDigestAPI";

export interface CategoryTone {
  /** 札（薄い背景 + 左の色線 + 色文字） */
  tag: string;
  /** 選択中フィルタの塗りつぶし */
  solid: string;
}

// Tailwind がクラスを検出できるよう、すべて完全な文字列で記述する
export const CATEGORY_TONE: Record<DigestCategory, CategoryTone> = {
  new_feature: { tag: "border-shu bg-shu/10 text-shu", solid: "border-shu bg-shu text-paper" },
  improvement: { tag: "border-ai bg-ai/10 text-ai", solid: "border-ai bg-ai text-paper" },
  bug_fix: { tag: "border-moegi bg-moegi/10 text-moegi", solid: "border-moegi bg-moegi text-paper" },
  deprecation: { tag: "border-oudo bg-oudo/10 text-[#7d5b10]", solid: "border-oudo bg-oudo text-paper" },
  breaking_change: { tag: "border-enji bg-enji/10 text-enji", solid: "border-enji bg-enji text-paper" },
  other: { tag: "border-ink-faint bg-ink-faint/10 text-ink-soft", solid: "border-ink-soft bg-ink-soft text-paper" },
};
