import Link from "next/link";
import { listDigests, getScrapeStatus } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";

export const revalidate = 60; // ISR: 60秒

/** ISO 8601 文字列を日本時間の「YYYY年M月D日 HH:mm」形式に変換する */
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

export default async function Home() {
  const [digestsResult, statusResult] = await Promise.allSettled([
    listDigests({ limit: 30 }),
    getScrapeStatus(),
  ]);
  const data = digestsResult.status === "fulfilled" ? digestsResult.value : null;
  const lastCheckedAt =
    statusResult.status === "fulfilled" ? statusResult.value.lastCheckedAt : null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
            <p className="text-sm text-gray-500">
              Claude の最新リリース情報を日本語でわかりやすくお届けします
            </p>
            {lastCheckedAt && (
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
                公式リリース最終チェック: {formatLastCheckedAt(lastCheckedAt)}
              </p>
            )}
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            このサイトについて
          </Link>
        </div>
        <DigestList initialArticles={data?.items ?? []} initialNextCursor={data?.nextCursor ?? null} />
      </div>
    </main>
  );
}
