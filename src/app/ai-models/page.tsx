import type { Metadata } from "next";
import Link from "next/link";
import { mono } from "@/app/fonts";
import { getModelComparison } from "@/generated/api/claudeDigestAPI";
import { ModelComparisonTabs } from "@/components/models/ModelComparisonTabs";
import { BenchmarkPanel } from "@/components/models/BenchmarkPanel";
import { TrendingModelsPanel } from "@/components/models/TrendingModelsPanel";
import { AutoCollectedNotice, ModelPageHero, StatStrip } from "@/components/models/ModelPageHero";
import { parseTab, resolveModelComparison } from "@/lib/modelComparison";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "話題の AI 比較（話題の AI モデル・ベンチマーク比較） | Claude Digest",
  description:
    "いま話題の AI モデルと、主要ベンチマークでの Claude と他社モデルのスコア比較を日本語でまとめています。毎日自動更新。",
};

interface AiModelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AiModelsPage({ searchParams }: AiModelsPageProps) {
  const [{ tab }, response] = await Promise.all([
    searchParams,
    getModelComparison({ timeout: 8000 }).catch(() => null),
  ]);
  const data = resolveModelComparison(response);
  const initialTab = parseTab(tab);

  return (
    <main className={`${mono.variable} min-h-screen`}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        <ModelPageHero
          eyebrow="AI Model Index"
          title="話題の AI 比較"
          description="いま話題の AI モデルと、主要ベンチマークでの Claude と他社モデルのスコアを比較できます。"
          updatedAt={data.aiModelsUpdatedAt}
          fallbackUpdatedLabel="初回更新待ち"
          aside={
            <StatStrip
              stats={[
                { label: "話題のモデル", value: data.trendingModels.length },
                { label: "ベンチマーク", value: data.benchmarks.length },
              ]}
            />
          }
        />

        <ModelComparisonTabs
          initialTab={initialTab}
          counts={{ trending: data.trendingModels.length, benchmarks: data.benchmarks.length }}
          panels={{
            trending: <TrendingModelsPanel models={data.trendingModels} />,
            benchmarks: (
              <BenchmarkPanel
                benchmarks={data.benchmarks}
                claudeModelNames={data.claudeModels.map((m) => m.name)}
              />
            ),
          }}
        />

        <AutoCollectedNotice>
          ベンチマークのスコアは出典を確認できたもののみ掲載しています。正確な情報は各社の公式発表をご確認ください。
        </AutoCollectedNotice>

        <section className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-gray-600">Claude の各モデルの違いや選び方はこちら。</p>
          <Link
            href="/models"
            className="inline-flex flex-shrink-0 items-center rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
          >
            Claude モデル比較を見る
          </Link>
        </section>
      </div>
    </main>
  );
}
