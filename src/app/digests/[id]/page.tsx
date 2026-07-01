import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDigestById } from "@/generated/api/claudeDigestAPI";
import { DigestDetail } from "@/components/DigestDetail";
import Link from "next/link";

export const revalidate = false

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await getDigestById(id);
    return {
      title: `${article.title} | Claude Digest`,
      description: article.keyPoints.slice(0, 3).join("、"),
      openGraph: {
        title: article.title,
        description: article.keyPoints.slice(0, 3).join("、"),
        type: "article",
        publishedTime: article.publishedAt,
      },
    };
  } catch {
    return {
      title: "記事が見つかりません | Claude Digest",
    };
  }
}

export default async function DigestDetailPage({ params }: PageProps) {
  const { id } = await params;
  let article;
  try {
    article = await getDigestById(id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <nav className="mb-6">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← ダイジェスト一覧に戻る
          </Link>
        </nav>
        <DigestDetail article={article} />
      </div>
    </main>
  );
}
