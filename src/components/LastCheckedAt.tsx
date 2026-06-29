"use client";

import { useGetScrapeStatus } from "@/generated/api/claudeDigestAPI";

function formatLastCheckedAt(iso: string): string {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}年${get("month")}月${get("day")}日 ${get("hour")}:${get("minute")}`;
}

export function LastCheckedAt() {
  const { data } = useGetScrapeStatus();
  if (!data?.lastCheckedAt) return null;

  return (
    <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      公式リリース最終チェック: {formatLastCheckedAt(data.lastCheckedAt)}
    </p>
  );
}