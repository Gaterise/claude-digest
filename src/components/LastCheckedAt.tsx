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
    <p className="flex items-center gap-2 text-[11px] text-ink-soft">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-shu opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-shu" />
      </span>
      公式リリース最終チェック:
      {isLoading ? (
        <span className="inline-block h-3 w-32 animate-pulse bg-paper-deep" />
      ) : data?.lastCheckedAt ? (
        <span className="font-mono tracking-wide text-ink">{formatLastCheckedAt(data.lastCheckedAt)}</span>
      ) : (
        <span className="font-mono text-ink-faint">―</span>
      )}
    </p>
  );
}
