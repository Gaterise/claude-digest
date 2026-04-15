import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | Claude Digest",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">利用規約</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800">1. サービスについて</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Claude Digest（以下「本サービス」）は、Anthropic が公開する Claude の変更ログを
              AI を使用して日本語に要約・提供する非公式サービスです。
              Anthropic 社とは一切関係ありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">2. 免責事項</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービスが提供するコンテンツは AI による自動要約であり、正確性を保証するものではありません。
              公式情報は必ず
              <a
                href="https://github.com/anthropics/claude-code/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mx-1"
              >
                公式リリースノート
              </a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">3. 禁止事項</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>本サービスへの不正アクセス・過負荷をかける行為</li>
              <li>本サービスのコンテンツを無断で商業利用する行為</li>
              <li>法令・公序良俗に反する利用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">4. サービスの変更・終了</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービスは予告なく変更・停止・終了する場合があります。
              これによって生じた損害について、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">5. 著作権</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービスのデザイン・コードは運営者に帰属します。
              要約コンテンツの原著作権は Anthropic に帰属します。
            </p>
          </section>

          <p className="text-xs text-gray-400">最終更新日: 2026年4月15日</p>
        </div>
      </div>
    </main>
  );
}
