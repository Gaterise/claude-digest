import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";
import { LastCheckedAt } from "@/components/LastCheckedAt";
import { TrendsSidebar } from "@/components/TrendsSidebar";
import { bodoni, mincho, mono } from "@/app/fonts";
import { getJstDateParts } from "@/lib/digestLedger";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await listDigests({ limit: 30 }).catch(() => null);
  const today = getJstDateParts(new Date().toISOString());

  return (
    <main className={`${mincho.variable} ${bodoni.variable} ${mono.variable} ledger-paper min-h-screen text-ink`}>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* 題字 */}
        <header className="mb-10 motion-safe:animate-ledger-rise">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink pb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            <span>Claude Code Release Ledger</span>
            <span className="normal-case tracking-[0.15em]">{today.label}</span>
          </div>
          <div className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <h1 className="font-mincho text-[2.6rem] font-extrabold leading-none tracking-[0.04em] text-ink sm:text-6xl">
                <span className="sr-only">Claude Digest ― </span>
                変更ログ<span className="text-shu">台帳</span>
              </h1>
              <p className="mt-4 max-w-xl font-mincho text-sm leading-loose text-ink-soft sm:text-[15px]">
                Claude Code の公式リリースを、一件ずつ日本語で書き留めています。
                <br className="hidden sm:inline" />
                版ごとの要点だけを、日付順にどうぞ。
              </p>
            </div>
            <LastCheckedAt />
          </div>
          <div aria-hidden="true" className="h-[5px] border-y border-ink" />
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
