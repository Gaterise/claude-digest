import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import { getModelComparison } from "@/generated/api/claudeDigestAPI";
import { ModelComparisonTabs } from "@/components/models/ModelComparisonTabs";
import { ClaudeModelsPanel } from "@/components/models/ClaudeModelsPanel";
import { BenchmarkPanel } from "@/components/models/BenchmarkPanel";
import { TrendingModelsPanel } from "@/components/models/TrendingModelsPanel";
import { formatJstDateTime, parseTab, resolveModelComparison } from "@/lib/modelComparison";

// 数値・モデルID用の等幅フォント。Tailwind の font-mono（var(--font-mono)）をページ内で差し替える
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI モデル比較（Claude・ベンチマーク・話題のモデル） | Claude Digest",
  description:
    "Claude の各モデルの違い、主要ベンチマークでの他社モデルとの比較、いま話題の AI モデルを日本語でまとめています。毎日自動更新。",
};

interface ModelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const [{ tab }, response] = await Promise.all([
    searchParams,
    getModelComparison({ timeout: 8000 }).catch(() => null),
  ]);
  const data = resolveModelComparison(response);
  const initialTab = parseTab(tab);

  const stats = [
    { label: "Claude モデル", value: data.claudeModels.length },
    { label: "ベンチマーク", value: data.benchmarks.length },
    { label: "話題のモデル", value: data.trendingModels.length },
  ];

  return (
    <main className={`${mono.variable} min-h-screen`}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        {/* ヒーロー */}
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
                Model Index
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">AI モデル比較</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Claude 各モデルの特徴と使い分けに加え、主要ベンチマークでの他社モデルとの比較、
                いま話題の AI モデルをまとめています。
              </p>
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
                  <time
                    className="font-mono tabular-nums"
                    dateTime={data.lastUpdatedAt ?? undefined}
                  >
                    {data.lastUpdatedAt ? formatJstDateTime(data.lastUpdatedAt) : "2026年6月時点の情報"}
                  </time>
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse px-4 py-3 text-center">
                  <dt className="mt-0.5 whitespace-nowrap text-[10px] text-gray-500">{s.label}</dt>
                  <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
                    {String(s.value).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ModelComparisonTabs
          initialTab={initialTab}
          counts={{
            claude: data.claudeModels.length,
            benchmarks: data.benchmarks.length,
            trending: data.trendingModels.length,
          }}
          panels={{
            claude: <ClaudeModelsPanel models={data.claudeModels} note={data.claudeNote} />,
            benchmarks: (
              <BenchmarkPanel
                benchmarks={data.benchmarks}
                claudeModelNames={data.claudeModels.map((m) => m.name)}
              />
            ),
            trending: <TrendingModelsPanel models={data.trendingModels} />,
          }}
        />

        {/* 注意事項 */}
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-amber-900">
            本ページの情報は、Google 検索をもとに AI が毎日自動で収集・要約したもので、誤りを含む可能性があります。
            ベンチマークのスコアは出典を確認できたもののみ掲載しています。最新のモデル情報・価格は
            <a
              href="https://platform.claude.com/docs/en/about-claude/models/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 font-medium underline hover:text-amber-700"
            >
              Anthropic 公式ドキュメント
            </a>
            や各社の公式発表をご確認ください。
          </p>
        </section>

        {/* CTA */}
        <section className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-gray-600">
            Claude の最新アップデート情報は記事一覧でチェックできます。
          </p>
          <Link
            href="/"
            className="inline-flex flex-shrink-0 items-center rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
          >
            記事一覧を見る
          </Link>
        </section>
      </div>
    </main>
  );
}
