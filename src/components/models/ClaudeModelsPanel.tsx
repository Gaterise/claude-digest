import type { ClaudeModel } from "@/generated/api/model";
import { getFamilyTheme } from "@/lib/modelComparison";

interface ClaudeModelsPanelProps {
  models: ClaudeModel[];
  note: string | null;
}

const SPEC_ROWS: { label: string; get: (m: ClaudeModel) => string; mono?: boolean }[] = [
  { label: "モデルID", get: (m) => m.modelId, mono: true },
  { label: "位置づけ", get: (m) => m.tagline },
  { label: "コンテキスト長", get: (m) => m.context },
  { label: "最大出力", get: (m) => m.maxOutput },
  { label: "入力価格（100万トークン）", get: (m) => m.priceInput, mono: true },
  { label: "出力価格（100万トークン）", get: (m) => m.priceOutput, mono: true },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function ModelCard({ model }: { model: ClaudeModel }) {
  const theme = getFamilyTheme(model.family);
  return (
    <article
      data-testid={`claude-model-card-${model.modelId}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border ${theme.border} bg-white shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className={`h-1 bg-gradient-to-r ${theme.rule}`} aria-hidden="true" />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[7rem] font-black leading-none opacity-[0.07] ${theme.text}`}
      >
        {model.family.charAt(0)}
      </span>

      <div className="relative px-5 pb-4 pt-4">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${theme.badge}`}>
          {model.tagline}
        </span>
        <h3 className="mt-2 text-lg font-bold text-gray-900">{model.name}</h3>
        <code className="mt-1 block break-all font-mono text-xs text-gray-500">{model.modelId}</code>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{model.description}</p>

        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
          Strengths / 得意なこと
        </p>
        <ul className="mt-2 space-y-1.5">
          {model.strengths.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckIcon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${theme.text}`} />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <dl className={`relative mt-auto grid grid-cols-3 divide-x divide-white border-t ${theme.border} ${theme.soft} text-center`}>
        {[
          { label: "コンテキスト", value: model.context },
          { label: "入力 / 1M", value: model.priceInput },
          { label: "出力 / 1M", value: model.priceOutput },
        ].map((item) => (
          <div key={item.label} className="px-2 py-2.5">
            <dt className="text-[10px] font-medium text-gray-500">{item.label}</dt>
            <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/** Claude モデルタブ: モデルカード・スペック比較表・使い分けガイド */
export function ClaudeModelsPanel({ models, note }: ClaudeModelsPanelProps) {
  return (
    <div className="space-y-8">
      <section aria-label="Claude モデル一覧" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {models.map((model) => (
          <ModelCard key={model.modelId} model={model} />
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 id="spec-table-heading" className="text-lg font-bold text-gray-900">
          スペック比較表
        </h3>
        <div className="relative mt-4 overflow-x-auto">
          <table aria-labelledby="spec-table-heading" className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="py-2.5 pr-4 text-left text-xs font-semibold text-gray-500">
                  項目
                </th>
                {models.map((m) => {
                  const theme = getFamilyTheme(m.family);
                  return (
                    <th key={m.modelId} scope="col" className={`px-3 py-2.5 text-left font-semibold ${theme.text}`}>
                      {m.family}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SPEC_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="py-2.5 pr-4 text-left text-xs font-medium text-gray-500">
                    {row.label}
                  </th>
                  {models.map((m) => (
                    <td key={m.modelId} className="px-3 py-2.5 text-gray-800">
                      {row.mono ? (
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs tabular-nums">
                          {row.get(m)}
                        </code>
                      ) : (
                        row.get(m)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-1 text-xs leading-relaxed text-gray-500">
          <p>※ 価格は API 利用時のもので、100万トークンあたりの米ドル表記です。</p>
          {note && <p>{note}</p>}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-bold text-gray-900">どのモデルを選べばいい？</h3>
        <ul className="mt-4 space-y-4">
          {models.map((m) => {
            const theme = getFamilyTheme(m.family);
            return (
              <li key={m.modelId} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${theme.badge}`}
                >
                  {m.family.charAt(0)}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">
                  <strong className="font-semibold text-gray-900">{m.guideTitle}</strong>{" "}
                  <span>{m.guideText}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
