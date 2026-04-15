import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";

export const revalidate = 60; // ISR: 60秒

export default async function Home() {
  let data;
  try {
    data = await listDigests({ limit: 50 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">変更ログ一覧</h2>
          <p className="text-sm text-gray-500">
            Claude の最新リリース情報を日本語でわかりやすくお届けします
          </p>
        </div>
        <DigestList initialArticles={data?.items ?? []} />
      </div>
    </main>
  );
}
