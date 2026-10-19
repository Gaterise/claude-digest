"use client";

import { useGetScrapeStatus } from "@/generated/api/claudeDigestAPI";
import { formatLastChecked } from "@/lib/digestLedger";

export function LastCheckedAt() {
  const { data, isLoading } = useGetScrapeStatus();

  return (
    <p className="flex items-center gap-2 whitespace-nowrap text-[11px] text-ink-soft">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-shu opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-shu" />
      </span>
      最終チェック
      {isLoading ? (
        <span className="inline-block h-3 w-16 animate-pulse bg-paper-deep" />
      ) : data?.lastCheckedAt ? (
        <time dateTime={data.lastCheckedAt} className="font-mono tracking-wide text-ink">
          {formatLastChecked(data.lastCheckedAt)}
        </time>
      ) : (
        <span className="font-mono text-ink-faint">―</span>
      )}
    </p>
  );
}
