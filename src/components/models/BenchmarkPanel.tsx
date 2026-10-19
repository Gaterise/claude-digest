import type { Benchmark } from "@/generated/api/model";
import {
  findBestScore,
  formatScore,
  getBenchmarkColumns,
  isSafeHttpUrl,
} from "@/lib/modelComparison";

interface BenchmarkPanelProps {
  benchmarks: Benchmark[];
  claudeModelNames: string[];
}

/** セル内バーの長さ（0〜1）。% は絶対値、その他の単位は行内の最良値に対する相対値 */
function barRatio(score: number, best: number, benchmark: Benchmark): number {
  if (benchmark.unit === "%") return Math.min(Math.max(score / 100, 0), 1);
  if (best === 0 || score === 0) return 0;
  const ratio = benchmark.higherIsBetter ? score / best : best / score;
  return Math.min(Math.max(ratio, 0), 1);
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11 3a1 1 0 1 0 0 2h2.586l-6.293 6.293a1 1 0 1 0 1.414 1.414L15 6.414V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5Z" />
      <path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2H5Z" />
    </svg>
  );
}

/** ベンチマーク比較タブ: ベンチマーク × モデルの比較表 */
export function BenchmarkPanel({ benchmarks, claudeModelNames }: BenchmarkPanelProps) {
  if (benchmarks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <p className="text-sm font-medium text-gray-600">ベンチマーク情報を準備中です</p>
        <p className="mt-1 text-xs text-gray-400">毎日 6:00 の自動更新後に表示されます</p>
      </div>
    );
  }

  const columns = getBenchmarkColumns(benchmarks, claudeModelNames);
  const claudeSet = new Set(claudeModelNames);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <h3 id="benchmark-table-heading" className="text-lg font-bold text-gray-900">
            ベンチマーク比較表
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            いま注目されているベンチマークを AI が選定。出典を確認できたスコアのみ掲載しています。
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500" aria-label="凡例">
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-300" aria-hidden="true" />
            最高スコア
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#d97757]" aria-hidden="true" />
            Claude モデル
          </li>
          <li className="flex items-center gap-1.5">
            <span className="font-mono text-gray-400" aria-hidden="true">―</span>
            出典付きデータなし
          </li>
        </ul>
      </div>

      <div className="relative overflow-x-auto">
        <table aria-labelledby="benchmark-table-heading" className="w-full min-w-max border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 min-w-[11rem] max-w-[14rem] border-b border-r border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:min-w-[15rem]"
              >
                ベンチマーク
              </th>
              {columns.map((model) => (
                <th
                  key={model}
                  scope="col"
                  className={`min-w-[7.5rem] border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-semibold ${
                    claudeSet.has(model) ? "border-t-2 border-t-[#d97757] text-gray-900" : "text-gray-600"
                  }`}
                >
                  {model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((benchmark) => {
              const best = findBestScore(benchmark);
              return (
                <tr key={benchmark.name} className="group">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-[11rem] max-w-[14rem] border-b border-r border-gray-100 bg-white px-4 py-3 text-left align-top font-normal group-hover:bg-gray-50 sm:min-w-[15rem]"
                  >
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">{benchmark.name}</span>
                      {benchmark.unit && (
                        <span className="rounded bg-gray-100 px-1 font-mono text-[10px] text-gray-500">
                          {benchmark.unit}
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-gray-500">
                      {benchmark.description}
                    </span>
                  </th>
                  {columns.map((model) => {
                    const entry = benchmark.scores.find((s) => s.model === model);
                    const valid = entry && isSafeHttpUrl(entry.sourceUrl) ? entry : null;
                    const isBest = valid !== null && best !== null && valid.score === best;
                    const formatted = valid ? formatScore(valid.score, benchmark.unit) : "";
                    return (
                      <td
                        key={model}
                        data-testid={`benchmark-cell-${benchmark.name}-${model}`}
                        data-best={isBest ? "true" : "false"}
                        className={`border-b border-gray-100 px-3 py-3 align-top ${
                          isBest ? "bg-amber-50" : "group-hover:bg-gray-50"
                        }`}
                      >
                        {valid ? (
                          <a
                            href={valid.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${model} の ${benchmark.name} スコア ${formatted} の出典（新しいタブで開く）`}
                            className="group/score block rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            <span className="flex items-center gap-1">
                              <span
                                className={`font-mono text-sm tabular-nums ${
                                  isBest ? "font-bold text-amber-800" : "font-medium text-gray-800"
                                }`}
                              >
                                {formatted}
                              </span>
                              {isBest && (
                                <span aria-hidden="true" className="text-[11px] text-amber-500">
                                  ★
                                </span>
                              )}
                              <ExternalIcon className="ml-auto h-3 w-3 text-gray-300 transition-colors group-hover/score:text-blue-500" />
                            </span>
                            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                              <span
                                className={`block h-full rounded-full ${
                                  isBest ? "bg-amber-400" : claudeSet.has(model) ? "bg-[#d97757]/70" : "bg-gray-400/70"
                                }`}
                                style={{ width: `${Math.round(barRatio(valid.score, best ?? valid.score, benchmark) * 100)}%` }}
                              />
                            </span>
                          </a>
                        ) : (
                          <span className="font-mono text-gray-300" title="出典付きのデータなし">
                            ―<span className="sr-only">出典付きのデータなし</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-[11px] text-gray-400 sm:hidden">← 表は横にスクロールできます →</p>
    </section>
  );
}
