import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claude モデル比較 | Claude Digest",
  description:
    "Claude の各モデル（Fable・Opus・Sonnet・Haiku）の違いをわかりやすく比較。モデルID・価格・コンテキスト長・得意分野を日本語で解説します。",
};

/** 2026年6月時点の公式情報に基づくモデルデータ */
const MODELS = [
  {
    family: "Fable",
    name: "Claude Fable 5",
    modelId: "claude-fable-5",
    tagline: "最上位モデル",
    color: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      accent: "text-amber-500",
    },
    context: "100万トークン",
    maxOutput: "12.8万トークン",
    priceInput: "$10.00",
    priceOutput: "$50.00",
    description:
      "2026年6月に登場した、広く利用できるモデルとしては最も高性能な新ファミリー。最高難度の推論や長時間にわたる自律的なエージェント作業など、最大限の能力が求められる用途向けです。",
    strengths: [
      "最高難度の推論・問題解決",
      "超長時間の自律エージェント作業",
      "Opus でも難しい複雑なタスク",
      "能力を最優先したい場面",
    ],
  },
  {
    family: "Opus",
    name: "Claude Opus 4.8",
    modelId: "claude-opus-4-8",
    tagline: "高性能",
    color: {
      border: "border-violet-200",
      bg: "bg-violet-50",
      text: "text-violet-700",
      badge: "bg-violet-100 text-violet-700",
      accent: "text-violet-500",
    },
    context: "100万トークン",
    maxOutput: "12.8万トークン",
    priceInput: "$5.00",
    priceOutput: "$25.00",
    description:
      "Claude ファミリーで最も高性能なモデル。長時間の自律的なエージェント作業、複雑なコーディング、高度な分析・リサーチに最適。難しいタスクほど真価を発揮します。",
    strengths: [
      "複雑で長時間のコーディング作業",
      "自律的なエージェントタスク",
      "高度な分析・リサーチ・文書作成",
      "長期的な記憶を活用するタスク",
    ],
  },
  {
    family: "Sonnet",
    name: "Claude Sonnet 4.6",
    modelId: "claude-sonnet-4-6",
    tagline: "バランス型",
    color: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      accent: "text-blue-500",
    },
    context: "100万トークン",
    maxOutput: "6.4万トークン",
    priceInput: "$3.00",
    priceOutput: "$15.00",
    description:
      "速度と知能のバランスが最も優れたモデル。日常的なコーディングやチャット、業務での利用など、幅広い用途で高いコストパフォーマンスを発揮します。",
    strengths: [
      "日常的なコーディング・開発作業",
      "チャットアシスタント・カスタマーサポート",
      "文章生成・要約・翻訳",
      "コストと品質の両立が必要な業務",
    ],
  },
  {
    family: "Haiku",
    name: "Claude Haiku 4.5",
    modelId: "claude-haiku-4-5",
    tagline: "高速・低コスト",
    color: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-500",
    },
    context: "20万トークン",
    maxOutput: "6.4万トークン",
    priceInput: "$1.00",
    priceOutput: "$5.00",
    description:
      "最も高速かつ低コストなモデル。シンプルなタスクを大量に処理する場合や、応答速度が重要なリアルタイム用途に最適です。",
    strengths: [
      "分類・タグ付けなどの定型処理",
      "大量データの一括処理",
      "リアルタイム性が求められるアプリ",
      "コストを最小限に抑えたい場合",
    ],
  },
];

const COMPARISON_ROWS = [
  {
    label: "モデルID",
    values: MODELS.map((m) => m.modelId),
    mono: true,
  },
  {
    label: "位置づけ",
    values: MODELS.map((m) => m.tagline),
  },
  {
    label: "コンテキスト長",
    values: MODELS.map((m) => m.context),
  },
  {
    label: "最大出力",
    values: MODELS.map((m) => m.maxOutput),
  },
  {
    label: "入力価格（100万トークンあたり）",
    values: MODELS.map((m) => m.priceInput),
  },
  {
    label: "出力価格（100万トークンあたり）",
    values: MODELS.map((m) => m.priceOutput),
  },
];

export default function ModelsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        {/* ヒーロー */}
        <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Claude モデル比較
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Claude には性能・速度・価格の異なる4つのモデルファミリー（Fable・Opus・Sonnet・Haiku）があります。
              それぞれの特徴と使い分けのポイントをわかりやすくまとめました。
            </p>
            <p className="mt-3 inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-gray-600">
              2026年6月時点の情報
            </p>
          </div>
        </section>

        {/* モデルカード */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {MODELS.map((model) => (
            <div
              key={model.modelId}
              className={`flex flex-col rounded-xl border ${model.color.border} bg-white shadow-sm`}
            >
              <div className={`rounded-t-xl ${model.color.bg} px-5 py-4`}>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${model.color.badge}`}
                >
                  {model.tagline}
                </span>
                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  {model.name}
                </h2>
                <code className="mt-1 block break-all text-xs text-gray-500">
                  {model.modelId}
                </code>
              </div>
              <div className="flex flex-1 flex-col px-5 py-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  {model.description}
                </p>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  得意なこと
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {model.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${model.color.accent}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* 比較表 */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">スペック比較表</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2.5 pr-4 text-left font-semibold text-gray-500">
                    項目
                  </th>
                  {MODELS.map((m) => (
                    <th
                      key={m.modelId}
                      className={`px-3 py-2.5 text-left font-semibold ${m.color.text}`}
                    >
                      {m.family}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 pr-4 font-medium text-gray-500">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-3 py-2.5 text-gray-800">
                        {row.mono ? (
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                            {v}
                          </code>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            ※ 価格は API 利用時のもので、100万トークンあたりの米ドル表記です。
            旧バージョンのモデル（Opus 4.7 / 4.6 など）も引き続き利用できます。
            また、招待制の研究プログラム向けに Claude Mythos 5 という限定提供モデルも存在します。
          </p>
        </section>

        {/* 使い分けガイド */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            どのモデルを選べばいい？
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                F
              </span>
              <p className="text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">
                  最大限の能力が必要なら Fable。
                </strong>
                Opus を上回る最上位モデルです。価格も最も高いため、最高難度のタスクに絞って使うのがおすすめです。
              </p>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                O
              </span>
              <p className="text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">
                  難しいタスクには Opus。
                </strong>
                大規模なリファクタリングや長時間の自律作業など、高い知能が必要な場面で選びます。
                Claude Code のデフォルトモデルでもあります。
              </p>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                S
              </span>
              <p className="text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">
                  迷ったら Sonnet。
                </strong>
                ほとんどの用途で十分な性能を、Opus より低コスト・高速で得られます。
                日常使いのバランス型です。
              </p>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                H
              </span>
              <p className="text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">
                  速さとコスト重視なら Haiku。
                </strong>
                単純なタスクの大量処理や、即時応答が求められるアプリに向いています。
              </p>
            </li>
          </ul>
        </section>

        {/* 注意事項 */}
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-amber-900">
            本ページの情報は作成時点のものです。最新のモデル情報・価格は
            <a
              href="https://platform.claude.com/docs/en/about-claude/models/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 font-medium underline hover:text-amber-700"
            >
              Anthropic 公式ドキュメント
            </a>
            をご確認ください。
          </p>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
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