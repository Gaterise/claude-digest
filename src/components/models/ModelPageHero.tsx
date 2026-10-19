import type { ReactNode } from "react";
import { formatJstDateTime } from "@/lib/modelComparison";

interface ModelPageHeroProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  updatedAt: string | null;
  /** 自動更新データがまだないときの表示 */
  fallbackUpdatedLabel: string;
  /** 右側に表示する要素（件数ストリップや関連ページへのリンクなど） */
  aside?: ReactNode;
}

export function ModelPageHero({
  eyebrow,
  title,
  description,
  updatedAt,
  fallbackUpdatedLabel,
  aside,
}: ModelPageHeroProps) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle,rgb(148_163_184/0.35)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#d97757]/25 to-transparent blur-2xl"
      />
      <div className="relative grid gap-6 px-6 py-8 sm:px-8 sm:py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c2603f]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              毎日 6:00 自動更新
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              最終更新:{" "}
              <time className="font-mono tabular-nums" dateTime={updatedAt ?? undefined}>
                {updatedAt ? formatJstDateTime(updatedAt) : fallbackUpdatedLabel}
              </time>
            </span>
          </div>
        </div>
        {aside}
      </div>
    </section>
  );
}

export function StatStrip({ stats }: { stats: { label: string; value: number }[] }) {
  return (
    <dl
      className="grid divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse px-4 py-3 text-center">
          <dt className="mt-0.5 whitespace-nowrap text-[10px] text-gray-500">{s.label}</dt>
          <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
            {String(s.value).padStart(2, "0")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function AutoCollectedNotice({ children }: { children: ReactNode }) {
  return (
    <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <p className="text-sm leading-relaxed text-amber-900">
        本ページの情報は、Google 検索をもとに AI が毎日自動で収集・要約したもので、誤りを含む可能性があります。
        {children}
      </p>
    </section>
  );
}
