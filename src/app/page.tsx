import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";
import { LastCheckedAt } from "@/components/LastCheckedAt";
import { TrendsSidebar } from "@/components/TrendsSidebar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await listDigests({ limit: 30 }).catch(() => null);

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <header className="mb-8 border-b-[3px] border-double border-ink pb-4 motion-safe:animate-ledger-rise sm:mb-10">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <h1 className="font-mincho text-2xl font-extrabold tracking-[0.04em] text-ink sm:text-[1.9rem]">
                <span className="sr-only">Claude Digest ― </span>
                Claude Code の<span className="text-shu">更新情報</span>
              </h1>
              <p className="mt-1.5 font-mincho text-[13px] text-ink-soft">
                公式リリースの要点を、日本語で新しい順にまとめています。
              </p>
            </div>
            <LastCheckedAt />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <DigestList initialArticles={data?.items ?? []} initialNextCursor={data?.nextCursor ?? null} />
          </div>
          <aside className="mt-14 lg:sticky lg:top-20 lg:mt-0">
            <TrendsSidebar />
          </aside>
        </div>
      </div>
    </main>
  );
}
