import Link from "next/link";
import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";
import { LastCheckedAt } from "@/components/LastCheckedAt";

export const revalidate = false; // スクレイパーからのオンデマンド再検証に一任

export default async function Home() {
  const data = await listDigests({ limit: 30 }).catch(() => null);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
            <LastCheckedAt />
          </div>
          <div className="flex flex-wrap gap-2">
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
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
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              />
            </svg>
            claudeモデル比較
          </Link>
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
        </div>
        <DigestList initialArticles={data?.items ?? []} initialNextCursor={data?.nextCursor ?? null} />
      </div>
    </main>
  );
}
