import type { TrendingModel } from "@/generated/api/model";
import { isSafeHttpUrl } from "@/lib/modelComparison";

interface TrendingModelsPanelProps {
  models: TrendingModel[];
}

/** 話題の AI モデルタブ: Claude 以外で話題のモデルのカード一覧 */
export function TrendingModelsPanel({ models }: TrendingModelsPanelProps) {
  if (models.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <p className="text-sm font-medium text-gray-600">話題の AI モデル情報を準備中です</p>
        <p className="mt-1 text-xs text-gray-400">毎日 6:00 の自動更新後に表示されます</p>
      </div>
    );
  }

  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="話題の AI モデル">
      {models.map((model, i) => {
        const url = isSafeHttpUrl(model.url) ? model.url : null;
        return (
          <li key={`${model.name}-${i}`} className="flex">
            <article
              data-testid="trending-model-card"
              className="relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 select-none font-mono text-5xl font-black leading-none text-transparent [-webkit-text-stroke:1px_rgb(209_213_219)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-wrap items-center gap-2 pr-14">
                <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {model.provider}
                </span>
                <span className="font-mono text-[11px] text-gray-500">{model.releaseDate}</span>
              </div>
              <h3 className="mt-2 pr-14 text-lg font-bold text-gray-900">{model.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{model.summary}</p>

              <ul className="mt-3 space-y-1.5">
                {model.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-[0.45rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${model.name} の公式情報（新しいタブで開く）`}
                  className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  公式情報を見る
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
