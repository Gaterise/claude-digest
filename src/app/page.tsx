import Link from "next/link";
import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";

export const revalidate = 60; // ISR: 60秒

export default async function Home() {
  let data;
  try {
    data = await listDigests({ limit: 30 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
            <p className="text-sm text-gray-500">
              Claude の最新リリース情報を日本語でわかりやすくお届けします
            </p>
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
