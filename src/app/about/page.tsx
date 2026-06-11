import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このサイトについて | Claude Digest",
  description:
    "Claude Digest の仕組みについて。Claude の公式リリースノートを1時間ごとに自動チェックし、AI が日本語に要約して記事をお届けします。",
};

const STEPS = [
  {
    title: "公式リリースノートを自動チェック",
    description: (
      <>
        Anthropic が GitHub で公開している Claude Code の公式リリースノートを、
        <strong className="font-semibold text-gray-800">1時間ごと</strong>
        に自動でチェックしています。
      </>
    ),
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    title: "AI が日本語に要約",
    description: (
      <>
        新しいリリースを検出すると、AI が英語のリリースノートを
        <strong className="font-semibold text-gray-800">日本語に要約</strong>
        し、重要ポイントの抽出とカテゴリ分類（新機能・改善・バグ修正など）を自動で行います。
      </>
    ),
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
        />
      </svg>
    ),
  },
  {
    title: "ダイジェスト記事として公開",
    description: (
      <>
        要約が完了するとすぐに記事として公開されます。公式リリースから
        <strong className="font-semibold text-gray-800">通常1時間以内</strong>
        に新しい記事をお読みいただけます。
      </>
    ),
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5"
        />
      </svg>
    ),
  },
];

const STATS = [
  { value: "1時間ごと", label: "公式リリースのチェック頻度" },
  { value: "1時間以内", label: "リリースから記事公開まで" },
  { value: "自動再試行", label: "要約に失敗した場合" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        {/* ヒーロー */}
        <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              このサイトについて
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Claude Digest は、Anthropic の Claude（Claude Code）の変更ログを
              日本語でわかりやすくお届けする非公式サービスです。
              英語の公式リリースノートを読まなくても、最新のアップデート情報を手軽にキャッチアップできます。
            </p>
          </div>

          {/* 更新頻度サマリー */}
          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-4 text-center">
                <div className="text-lg font-bold text-blue-500">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 仕組み（タイムライン） */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            記事が公開されるまでの流れ
          </h2>
          <ol className="relative space-y-8">
            {/* 縦のつなぎ線 */}
            <span
              className="absolute left-5 top-2 -ml-px h-[calc(100%-2rem)] w-0.5 bg-blue-100"
              aria-hidden="true"
            />
            {STEPS.map((step, i) => (
              <li key={i} className="relative flex gap-4 sm:gap-5">
                <div className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500 ring-4 ring-white">
                  {step.icon}
                </div>
                <div className="pt-0.5">
                  <div className="text-xs font-semibold tracking-wide text-blue-500">
                    STEP {i + 1}
                  </div>
                  <h3 className="mt-0.5 font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-gray-500">
              情報源:
              <a
                href="https://github.com/anthropics/claude-code/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 text-blue-600 hover:underline"
              >
                anthropics/claude-code — GitHub Releases
              </a>
              （Anthropic 公式）
            </p>
          </div>
        </section>

        {/* 注意事項 */}
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-amber-900">
            <svg
              className="h-5 w-5 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            ご利用にあたって
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-amber-900">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
              <span>
                本サービスは Anthropic 社とは関係のない
                <strong className="font-semibold">非公式サービス</strong>です。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
              <span>
                記事は AI による自動要約のため、正確性を保証するものではありません。
                正確な情報は各記事内のリンクから公式リリースノートをご確認ください。
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-amber-700">
            詳しくは
            <Link href="/terms" className="mx-1 underline hover:text-amber-900">
              利用規約
            </Link>
            ・
            <Link href="/privacy" className="mx-1 underline hover:text-amber-900">
              プライバシーポリシー
            </Link>
            をご覧ください。
          </p>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-gray-600">
            ご意見・ご要望はお気軽にご連絡ください。
          </p>
          <div className="flex flex-shrink-0 gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              お問い合わせ
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
            >
              記事一覧を見る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}