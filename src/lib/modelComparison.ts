import type {
  Benchmark,
  ClaudeModel,
  ModelComparisonResponse,
  TrendingModel,
} from "@/generated/api/model";

/** 一度も日次更新が成功していない場合に表示する初期データ（2026年6月時点の公式情報） */
export const SEED_CLAUDE_MODELS: ClaudeModel[] = [
  {
    family: "Fable",
    name: "Claude Fable 5",
    modelId: "claude-fable-5",
    tagline: "最上位モデル",
    context: "100万トークン",
    maxOutput: "12.8万トークン",
    priceInput: "$10.00",
    priceOutput: "$50.00",
    description:
      "2026年6月に登場した、広く利用できるモデルとしては最も高性能な新ファミリー。最高難度の推論や長時間にわたる自律的なエージェント作業など、最大限の能力が求められる用途向けです。",
    strengths: [
      "最高難度の推論・問題解決",
      "超長時間の自律エージェント作業",
      "Opus でも難しい複雑なタスク",
      "能力を最優先したい場面",
    ],
    guideTitle: "最大限の能力が必要なら Fable。",
    guideText:
      "Opus を上回る最上位モデルです。価格も最も高いため、最高難度のタスクに絞って使うのがおすすめです。",
  },
  {
    family: "Opus",
    name: "Claude Opus 4.8",
    modelId: "claude-opus-4-8",
    tagline: "高性能",
    context: "100万トークン",
    maxOutput: "12.8万トークン",
    priceInput: "$5.00",
    priceOutput: "$25.00",
    description:
      "Claude ファミリーで最も高性能なモデル。長時間の自律的なエージェント作業、複雑なコーディング、高度な分析・リサーチに最適。難しいタスクほど真価を発揮します。",
    strengths: [
      "複雑で長時間のコーディング作業",
      "自律的なエージェントタスク",
      "高度な分析・リサーチ・文書作成",
      "長期的な記憶を活用するタスク",
    ],
    guideTitle: "難しいタスクには Opus。",
    guideText:
      "大規模なリファクタリングや長時間の自律作業など、高い知能が必要な場面で選びます。Claude Code のデフォルトモデルでもあります。",
  },
  {
    family: "Sonnet",
    name: "Claude Sonnet 4.6",
    modelId: "claude-sonnet-4-6",
    tagline: "バランス型",
    context: "100万トークン",
    maxOutput: "6.4万トークン",
    priceInput: "$3.00",
    priceOutput: "$15.00",
    description:
      "速度と知能のバランスが最も優れたモデル。日常的なコーディングやチャット、業務での利用など、幅広い用途で高いコストパフォーマンスを発揮します。",
    strengths: [
      "日常的なコーディング・開発作業",
      "チャットアシスタント・カスタマーサポート",
      "文章生成・要約・翻訳",
      "コストと品質の両立が必要な業務",
    ],
    guideTitle: "迷ったら Sonnet。",
    guideText:
      "ほとんどの用途で十分な性能を、Opus より低コスト・高速で得られます。日常使いのバランス型です。",
  },
  {
    family: "Haiku",
    name: "Claude Haiku 4.5",
    modelId: "claude-haiku-4-5",
    tagline: "高速・低コスト",
    context: "20万トークン",
    maxOutput: "6.4万トークン",
    priceInput: "$1.00",
    priceOutput: "$5.00",
    description:
      "最も高速かつ低コストなモデル。シンプルなタスクを大量に処理する場合や、応答速度が重要なリアルタイム用途に最適です。",
    strengths: [
      "分類・タグ付けなどの定型処理",
      "大量データの一括処理",
      "リアルタイム性が求められるアプリ",
      "コストを最小限に抑えたい場合",
    ],
    guideTitle: "速さとコスト重視なら Haiku。",
    guideText: "単純なタスクの大量処理や、即時応答が求められるアプリに向いています。",
  },
];

export const SEED_CLAUDE_NOTE =
  "旧バージョンのモデル（Opus 4.7 / 4.6 など）も引き続き利用できます。また、招待制の研究プログラム向けに Claude Mythos 5 という限定提供モデルも存在します。";

export interface ResolvedModelComparison {
  claudeModels: ClaudeModel[];
  claudeNote: string | null;
  /** Claude 区分が初期データ由来か */
  isClaudeSeed: boolean;
  benchmarks: Benchmark[];
  trendingModels: TrendingModel[];
  /** Claude モデル比較ページの更新日時（ISO 8601） */
  claudeUpdatedAt: string | null;
  /** 話題の AI 比較ページの更新日時（ベンチマーク・話題モデルのうち新しい方） */
  aiModelsUpdatedAt: string | null;
}

function latest(...timestamps: (string | null | undefined)[]): string | null {
  const valid = timestamps.filter((t): t is string => typeof t === "string");
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (new Date(a).getTime() >= new Date(b).getTime() ? a : b));
}

/** API レスポンスを区分ごとに初期データへフォールバックしつつ表示用に解決する */
export function resolveModelComparison(
  res: ModelComparisonResponse | null
): ResolvedModelComparison {
  const hasClaude = (res?.claudeModels.length ?? 0) > 0;

  return {
    claudeModels: hasClaude ? res!.claudeModels : SEED_CLAUDE_MODELS,
    claudeNote: hasClaude ? res!.claudeNote : SEED_CLAUDE_NOTE,
    isClaudeSeed: !hasClaude,
    benchmarks: res?.benchmarks ?? [],
    trendingModels: res?.trendingModels ?? [],
    claudeUpdatedAt: res?.updatedAt.claudeModels ?? null,
    aiModelsUpdatedAt: latest(res?.updatedAt.benchmarks, res?.updatedAt.trendingModels),
  };
}

/** 話題の AI 比較ページ（/ai-models）のタブ */
export const AI_MODEL_TABS = [
  { id: "trending", label: "話題の AI モデル" },
  { id: "benchmarks", label: "ベンチマーク比較" },
] as const;

export type ModelTabId = (typeof AI_MODEL_TABS)[number]["id"];

export const DEFAULT_TAB: ModelTabId = "trending";

const TAB_IDS = new Set<string>(AI_MODEL_TABS.map((t) => t.id));

/** URL の tab パラメータを解釈する（不正値は既定タブ） */
export function parseTab(value: string | string[] | undefined): ModelTabId {
  const v = Array.isArray(value) ? value[0] : value;
  return v && TAB_IDS.has(v) ? (v as ModelTabId) : DEFAULT_TAB;
}

/** 現在のクエリ文字列に tab を反映した新しいクエリ文字列を返す（既定タブでは削除） */
export function buildTabSearch(search: string, tab: ModelTabId): string {
  const params = new URLSearchParams(search);
  if (tab === DEFAULT_TAB) {
    params.delete("tab");
  } else {
    params.set("tab", tab);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** 外部リンクとして安全な http/https URL か */
export function isSafeHttpUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** 出典が有効なスコアの中での最高値（higherIsBetter=false なら最小値） */
export function findBestScore(benchmark: Benchmark): number | null {
  const values = benchmark.scores
    .filter((s) => isSafeHttpUrl(s.sourceUrl))
    .map((s) => s.score);
  if (values.length === 0) return null;
  return benchmark.higherIsBetter ? Math.max(...values) : Math.min(...values);
}

/** ベンチマーク表の列（Claude モデルを一覧順で先頭、その他は登場順） */
export function getBenchmarkColumns(benchmarks: Benchmark[], claudeModelNames: string[]): string[] {
  const appeared: string[] = [];
  for (const b of benchmarks) {
    for (const s of b.scores) {
      if (!appeared.includes(s.model)) appeared.push(s.model);
    }
  }
  const claude = claudeModelNames.filter((n) => appeared.includes(n));
  const others = appeared.filter((n) => !claudeModelNames.includes(n));
  return [...claude, ...others];
}

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatScore(score: number, unit: string): string {
  const n = numberFormat.format(score);
  if (!unit) return n;
  return unit === "%" ? `${n}%` : `${n} ${unit}`;
}

export function formatJstDateTime(iso: string): string {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}年${get("month")}月${get("day")}日 ${get("hour")}:${get("minute")}`;
}

export interface FamilyTheme {
  key: string;
  border: string;
  soft: string;
  text: string;
  badge: string;
  dot: string;
  rule: string;
}

const FAMILY_THEMES: Record<string, FamilyTheme> = {
  fable: {
    key: "fable",
    border: "border-amber-200",
    soft: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    rule: "from-amber-400 to-orange-400",
  },
  opus: {
    key: "opus",
    border: "border-violet-200",
    soft: "bg-violet-50",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
    rule: "from-violet-500 to-fuchsia-400",
  },
  sonnet: {
    key: "sonnet",
    border: "border-blue-200",
    soft: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
    rule: "from-blue-500 to-sky-400",
  },
  haiku: {
    key: "haiku",
    border: "border-emerald-200",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
    rule: "from-emerald-500 to-teal-400",
  },
};

const DEFAULT_THEME: FamilyTheme = {
  key: "default",
  border: "border-slate-200",
  soft: "bg-slate-50",
  text: "text-slate-700",
  badge: "bg-slate-100 text-slate-800",
  dot: "bg-slate-500",
  rule: "from-slate-500 to-slate-400",
};

export function getFamilyTheme(family: string): FamilyTheme {
  return FAMILY_THEMES[family.trim().toLowerCase()] ?? DEFAULT_THEME;
}
