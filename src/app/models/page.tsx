import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { getModelComparison } from "@/generated/api/claudeDigestAPI";
import { ClaudeModelsPanel } from "@/components/models/ClaudeModelsPanel";
import { AutoCollectedNotice, ModelPageHero } from "@/components/models/ModelPageHero";
import { resolveModelComparison } from "@/lib/modelComparison";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Claude モデル比較 | Claude Digest",
  description:
    "Claude の各モデル（Fable・Opus・Sonnet・Haiku など）の特徴・価格・コンテキスト長と使い分けを日本語でまとめています。毎日自動更新。",
};

interface ModelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MOVED_TABS = new Set(["benchmarks", "trending"]);

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const { tab } = await searchParams;
  const legacyTab = Array.isArray(tab) ? tab[0] : tab;
  // 旧3タブ構成の URL（?tab=benchmarks / trending）は話題の AI 比較ページへ転送する
  if (legacyTab && MOVED_TABS.has(legacyTab)) {
    permanentRedirect(legacyTab === "trending" ? "/ai-models" : `/ai-models?tab=${legacyTab}`);
  }

  const response = await getModelComparison({ timeout: 8000 }).catch(() => null);
  const data = resolveModelComparison(response);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        <ModelPageHero
          eyebrow="Claude Models"
          title="Claude モデル比較"
          description="Claude の各モデルの特徴・価格・コンテキスト長と、用途に合わせた選び方をまとめています。"
          updatedAt={data.claudeUpdatedAt}
          fallbackUpdatedLabel="2026年6月時点の情報"
          aside={
            <Link
              href="/ai-models"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm transition-colors hover:border-gray-300 hover:bg-white"
            >
              <span>
                <span className="block text-[10px] text-gray-500">他社モデルとも比べる</span>
                <span className="block text-sm font-semibold text-gray-900">話題の AI 比較</span>
              </span>
              <span aria-hidden="true" className="text-gray-400 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          }
        />

        <ClaudeModelsPanel models={data.claudeModels} note={data.claudeNote} />

        <AutoCollectedNotice>
          最新のモデル情報・価格は
          <a
            href="https://platform.claude.com/docs/en/about-claude/models/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 font-medium underline hover:text-amber-700"
          >
            Anthropic 公式ドキュメント
          </a>
          をご確認ください。
        </AutoCollectedNotice>

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
