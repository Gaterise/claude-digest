"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">エラーが発生しました</h1>
        <p className="mt-4 text-gray-600">
          {error.message || "予期しないエラーが発生しました"}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
