import { listDigests } from "@/generated/api/claudeDigestAPI";
import { DigestList } from "@/components/DigestList";

export const revalidate = 60; // ISR: 60秒

export default async function Home() {
  let data;
  try {
    data = await listDigests({ limit: 20 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Claude Digest</h1>
          <p className="mt-2 text-gray-600">
            Claude の変更ログを日本語でわかりやすくお届けします
          </p>
        </header>

        <DigestList initialArticles={data?.items ?? []} />
      </div>
    </main>
  );
}
