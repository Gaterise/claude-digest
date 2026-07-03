import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";
import { LastCheckedAt } from "@/components/LastCheckedAt";
import { TrendsSidebar } from "@/components/TrendsSidebar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await listDigests({ limit: 30 }).catch(() => null);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
              <LastCheckedAt />
            </div>
            <DigestList initialArticles={data?.items ?? []} initialNextCursor={data?.nextCursor ?? null} />
          </div>
          <aside className="mt-6 lg:sticky lg:top-20 lg:mt-0">
            <TrendsSidebar />
          </aside>
        </div>
      </div>
    </main>
  );
}