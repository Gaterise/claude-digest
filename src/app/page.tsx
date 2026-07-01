import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";
import { LastCheckedAt } from "@/components/LastCheckedAt";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await listDigests({ limit: 30 }).catch(() => null);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
          <LastCheckedAt />
        </div>
        <DigestList initialArticles={data?.items ?? []} initialNextCursor={data?.nextCursor ?? null} />
      </div>
    </main>
  );
}