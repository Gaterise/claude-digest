# Data Model: AI モデル比較

## Firestore: `meta/model_comparison`（単一ドキュメント・全置換）

| フィールド | 型 | 説明 |
|---|---|---|
| claudeModels | ClaudeModel[] | Claude 現行モデル（1〜6件） |
| claudeNote | string \| null | 旧バージョン・限定提供モデルなどの補足注記 |
| claudeModelsUpdatedAt | Timestamp \| null | Claude 区分の最終更新成功日時 |
| benchmarks | Benchmark[] | 注目ベンチマーク（3〜8件） |
| benchmarksUpdatedAt | Timestamp \| null | ベンチマーク区分の最終更新成功日時 |
| trendingModels | TrendingModel[] | 話題の AI モデル（3〜6件） |
| trendingModelsUpdatedAt | Timestamp \| null | 話題モデル区分の最終更新成功日時 |

## ClaudeModel

| フィールド | 型 | 検証 |
|---|---|---|
| family | string | 必須・非空（例: "Opus"） |
| name | string | 必須・非空（例: "Claude Opus 4.8"） |
| modelId | string | 必須・非空 |
| tagline | string | 必須（位置づけ。例: "高性能"） |
| context | string | 必須（例: "100万トークン"） |
| maxOutput | string | 必須 |
| priceInput | string | 必須（100万トークンあたり。例: "$5.00"） |
| priceOutput | string | 必須 |
| description | string | 必須 |
| strengths | string[] | 1〜6件、非空文字列 |
| guideTitle | string | 必須（使い分けガイド見出し。例: "迷ったら Sonnet。"） |
| guideText | string | 必須 |

## Benchmark

| フィールド | 型 | 検証 |
|---|---|---|
| name | string | 必須（例: "SWE-bench Verified"） |
| description | string | 必須（何を測るか） |
| unit | string | 必須（"%"、"Elo" など。空文字可=単位なし） |
| higherIsBetter | boolean | 省略時 true |
| scores | BenchmarkScore[] | 有効スコア1件以上 |

### BenchmarkScore

| フィールド | 型 | 検証 |
|---|---|---|
| model | string | 候補モデル名一覧に含まれること（含まれないものは破棄） |
| score | number | 有限数 |
| sourceUrl | string | http/https・パース可能・グラウンディング中継 URL 以外（満たさないスコアは破棄） |

## TrendingModel

| フィールド | 型 | 検証 |
|---|---|---|
| name | string | 必須、"Claude" を含むものは除外 |
| provider | string | 必須 |
| releaseDate | string | 必須（例: "2026年9月"） |
| summary | string | 必須 |
| highlights | string[] | 1〜4件 |
| url | string | http/https（不正なら null として保存・リンク非表示） |

## 区分ごとの状態遷移（日次更新）

```
生成成功 & 検証 OK  → 新データ + UpdatedAt=now に置換
生成失敗 / 検証 NG  → 前回データと前回 UpdatedAt を維持（未取得なら空配列 / null）
全区分失敗          → ドキュメントを書き込まない（エラーとしてログ・関数失敗）
```

## 件数制約の適用

| 区分 | 最小（未満なら区分失敗） | 最大（超過分は切り捨て） |
|---|---|---|
| claudeModels | 1 | 6 |
| benchmarks | 3 | 8 |
| trendingModels | 3 | 6 |
| ベンチマーク候補モデル | — | 10（Claude 優先） |
