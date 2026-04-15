import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Claude Digest",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← トップへ戻る
          </Link>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">プライバシーポリシー</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800">1. 収集する情報</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービス（Claude Digest）は、サービス改善のためにアクセスログ（IPアドレス、ブラウザ情報、参照元URL、アクセス日時）を収集することがあります。
              個人を特定できる情報は収集しておりません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">2. 情報の利用目的</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              収集した情報は、サービスの品質向上・障害対応・セキュリティ確保を目的として使用します。
              第三者への販売・提供は行いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">3. Cookie について</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービスは現在、Cookie を利用しておりません。
              将来的に利用する場合は、本ポリシーを更新してお知らせします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">4. 第三者サービス</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本サービスは Firebase（Google LLC）をインフラとして利用しています。
              Google のプライバシーポリシーが適用される場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">5. ポリシーの変更</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              本ポリシーは予告なく変更する場合があります。重要な変更がある場合は、サービス上でお知らせします。
            </p>
          </section>

          <p className="text-xs text-gray-400">最終更新日: 2026年4月15日</p>
        </div>
      </div>
    </main>
  );
}
