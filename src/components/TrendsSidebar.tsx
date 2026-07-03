"use client";

import { useGetTrends } from "@/generated/api/claudeDigestAPI";
import type { TrendItem } from "@/generated/api/claudeDigestAPI";

function formatGeneratedAt(iso: string): string {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")}/${get("day")} ${get("hour")}:${get("minute")}`;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

function TrendCard({ item, rank }: { item: TrendItem; rank: number }) {
  const query = encodeURIComponent(item.keyword);

  return (
    <li className="px-3 py-2.5" data-testid="trend-item">
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[11px] font-bold ${
            rank <= 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-gray-900">
            {item.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {item.summary}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <a
              href={`https://x.com/search?q=${query}&f=live`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              <XIcon className="h-2.5 w-2.5" />
              で検索
            </a>
            <a
              href={`https://www.threads.com/search?q=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              <ThreadsIcon className="h-3 w-3" />
              で検索
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

function TrendSkeleton() {
  return (
    <li className="px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse rounded bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </li>
  );
}

/** X / Threads で話題の AI トレンドを表示するサイドバー */
export function TrendsSidebar() {
  const { data, isLoading } = useGetTrends();

  const items = data?.items ?? [];

  return (
    <section
      data-testid="trends-sidebar"
      className="rounded-lg border border-gray-200 bg-white"
      aria-label="AIトレンド"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
        <h2 className="text-sm font-semibold text-gray-800">AIトレンド</h2>
        <div className="flex items-center gap-1.5 text-gray-400">
          <XIcon className="h-3 w-3" />
          <ThreadsIcon className="h-3.5 w-3.5" />
          <span className="text-[11px]">で話題</span>
        </div>
      </div>

      {isLoading ? (
        <ul className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <TrendSkeleton key={i} />
          ))}
        </ul>
      ) : items.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <TrendCard key={`${item.keyword}-${i}`} item={item} rank={i + 1} />
          ))}
        </ul>
      ) : (
        <p className="px-3 py-6 text-center text-xs text-gray-400">
          トレンド情報を準備中です
        </p>
      )}

      <div className="border-t border-gray-100 px-3 py-2">
        <p className="text-[10px] leading-relaxed text-gray-400">
          Google検索をもとにAIが自動生成
          {data?.generatedAt && ` ・ 更新: ${formatGeneratedAt(data.generatedAt)}`}
        </p>
      </div>
    </section>
  );
}