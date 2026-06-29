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
  const { data, isLoading } = useGetScrapeStatus();

  return (
    <p className="flex align-middle gap-1 h-4 text-xs font-medium text-gray-700">
      公式リリース最終チェック:{" "}
      {isLoading ? (
        <span className="inline-block  w-32 animate-pulse rounded bg-gray-200 align-middle" />
      ) : data?.lastCheckedAt ? (
        formatLastCheckedAt(data.lastCheckedAt)
      ) : null}
    </p>
  );
}