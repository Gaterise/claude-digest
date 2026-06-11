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
    description:
      "Anthropic が GitHub で公開している Claude Code の公式リリースノート（anthropics/claude-code の Releases）を、1時間ごとに自動でチェックしています。",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
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
    description:
      "新しいリリースを検出すると、AI（Google Gemini）が英語のリリースノートを日本語に要約し、重要ポイントの抽出とカテゴリ分類（新機能・改善・バグ修正など）を自動で行います。",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
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
    description:
      "要約が完了すると、すぐにダイジェスト記事としてサイトに公開されます。公式リリースから通常1時間程度で新しい記事をお読みいただけます。",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
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

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          このサイトについて
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Claude Digest は、Anthropic の Claude（Claude Code）の変更ログを
          日本語でわかりやすくお届けする非公式サービスです。
          英語の公式リリースノートを読まなくても、最新のアップデート情報を
          手軽にキャッチアップできます。
        </p>

        {/* 仕組み */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            記事が公開されるまでの流れ
          </h2>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <span className="mr-2 text-blue-500">STEP {i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 更新頻度まとめ */}
        <section className="mb-10 rounded-xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-blue-900 mb-3">
            更新タイミングまとめ
          </h2>
          <ul className="space-y-2 text-sm text-blue-950">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              公式リリースノートのチェック: <strong>1時間ごと</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              新リリース検出から記事公開まで: <strong>数分程度</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              要約の生成に失敗した場合: 次回チェック時に自動で再試行
            </li>
          </ul>
        </section>

        {/* 注意事項 */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            ご利用にあたって
          </h2>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li>
              本サービスは Anthropic 社とは関係のない<strong>非公式サービス</strong>です。
            </li>
            <li>
              記事は AI による自動要約のため、正確性を保証するものではありません。
              正確な情報は各記事内のリンクから
              <a
                href="https://github.com/anthropics/claude-code/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mx-1"
              >
                公式リリースノート
              </a>
              をご確認ください。
            </li>
            <li>
              詳しくは
              <Link href="/terms" className="text-blue-600 hover:underline mx-1">
                利用規約
              </Link>
              ・
              <Link href="/privacy" className="text-blue-600 hover:underline mx-1">
                プライバシーポリシー
              </Link>
              をご覧ください。
            </li>
          </ul>
        </section>

        {/* お問い合わせ */}
        <section>
          <p className="text-sm text-gray-600 leading-relaxed">
            ご意見・ご要望は
            <Link href="/contact" className="text-blue-600 hover:underline mx-1">
              お問い合わせページ
            </Link>
            よりお気軽にご連絡ください。
          </p>
        </section>
      </div>
    </main>
  );
}