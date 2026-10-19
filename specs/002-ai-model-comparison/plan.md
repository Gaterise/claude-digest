# Implementation Plan: AI モデル比較ページの日次自動更新とベンチマーク・話題モデル掲載

**Branch**: `002-ai-model-comparison` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ai-model-comparison/spec.md`

## Summary

`/models` ページを静的な直書きデータから、日次自動更新されるデータ駆動ページへ移行する。
Cloud Functions のスケジューラー（毎日 JST 06:00）で Google 検索グラウンディング付き Gemini を
3区分（Claude モデル / 話題の AI モデル / ベンチマーク）に分けて呼び出し、区分ごとに検証・マージして
Firestore `meta/model_comparison` に保存する。フロントエンドは新設の `GET /v1/model-comparison` から
取得し、区分ごとに「API データ → 未取得なら初期データ（現行ページ内容）」でフォールバックして
3タブ構成（Claude モデル / ベンチマーク比較 / 話題の AI モデル）で表示する。

## Technical Context

**Language/Version**: TypeScript 5.7（Next.js 15 / React 19、Cloud Functions は Node.js 20）  
**Primary Dependencies**: Next.js App Router, Tailwind CSS v4, TanStack Query, axios, firebase-functions v6 (v2 scheduler), firebase-admin, @google/genai（Vertex AI + googleSearch ツール）  
**Storage**: Firestore `meta/model_comparison`（1ドキュメントに最新スナップショットを全置換保存）  
**Testing**: Vitest + Testing Library（ルート `tests/`、functions のロジックもルートから import してテスト）、Playwright（E2E）  
**Target Platform**: Firebase Hosting (frameworks backend, asia-northeast1) + Cloud Functions v2  
**Project Type**: Web アプリケーション（Next.js フロント + Functions API）  
**Performance Goals**: ページは Firestore 1ドキュメント読み取りのみで描画。API 失敗時も初期データで即描画  
**Constraints**: Gemini の googleSearch ツールは JSON モード（responseSchema）と併用不可 → テキスト応答から JSON を抽出・検証。関数タイムアウト 540 秒以内  
**Scale/Scope**: Claude モデル 1〜6件、ベンチマーク 3〜8件、話題モデル 3〜6件、ベンチマーク表の列は最大10モデル

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 判定 | 対応 |
|------|------|------|
| I. TDD（NON-NEGOTIABLE） | ✅ | tasks.md でテストタスクを実装タスクより前に配置。Red 確認後にユーザー承認を取得してから実装 |
| II. 次の操作はユーザー確認必須 | ✅（例外承認済） | ユーザーが「フェーズ間は一括承認、テスト Red 確認時のみ承認」を明示的に指示（2026-10-16） |
| III. 日本語コミュニケーション | ✅ | 文書・UI・ログは日本語 |
| IV. 統合テストの徹底 | ✅ | 新 API `GET /v1/model-comparison` のコントラクトテスト（レスポンス変換関数）と、更新処理のオーケストレーションテストを作成 |
| V. シンプルさの優先 | ✅ | 既存トレンド機能と同じ構成（スケジューラー + Gemini + meta ドキュメント）を踏襲。新規依存なし。管理画面・履歴保存は作らない |

**Post-design re-check**: ✅ 違反なし（Complexity Tracking 不要）

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-model-comparison/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── model-comparison.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
functions/src/
├── modelComparison/
│   ├── parser.ts            # Gemini 応答の JSON 抽出・区分ごとの検証/正規化・URL 検証
│   ├── generator.ts         # 区分ごとの Gemini（googleSearch）呼び出し + リトライ
│   ├── updater.ts           # 3区分の生成→区分単位マージ（依存性注入でテスト可能）
│   ├── scheduler.ts         # onSchedule（毎日 06:00 Asia/Tokyo）
│   └── response.ts          # Firestore スナップショット → API レスポンス変換
├── firestore/modelComparisonRepository.ts
├── api/routes/modelComparison.ts   # GET /v1/model-comparison
├── api/index.ts             # ルート登録
├── types/index.ts           # ModelComparison 系型追加
└── index.ts                 # scheduledModelComparison を export

src/
├── app/models/page.tsx                      # データ駆動 + タブ構成へ刷新
├── app/sitemap.ts                           # changeFrequency を daily に
├── components/models/
│   ├── ModelComparisonTabs.tsx              # クライアント: ARIA タブ + URL 同期
│   ├── ClaudeModelsPanel.tsx                # Claude モデルカード・スペック表・使い分け
│   ├── BenchmarkPanel.tsx                   # ベンチマーク表（固定列・最高値強調・出典リンク）
│   └── TrendingModelsPanel.tsx              # 話題モデルカード
├── lib/modelComparison.ts                   # 初期データ・フォールバック解決・タブ解析・URL 検証・最高値算出
└── generated/api/{claudeDigestAPI.ts,model/index.ts}  # getModelComparison 追加（手動マッピング）

openapi.yaml                                  # /model-comparison 追加

tests/
├── unit/modelComparison/parser.test.ts
├── unit/modelComparison/updater.test.ts
├── unit/lib/modelComparison.test.ts
├── unit/components/ModelComparisonTabs.test.tsx
├── unit/components/ClaudeModelsPanel.test.tsx
├── unit/components/BenchmarkPanel.test.tsx
├── unit/components/TrendingModelsPanel.test.tsx
├── integration/api/modelComparison.test.ts  # レスポンス契約テスト
└── e2e/models.spec.ts
```

**Structure Decision**: 既存のモノレポ構成（ルート Next.js + `functions/`）をそのまま使用。
バックエンドの新ロジックは `functions/src/modelComparison/` に集約し、既存の `summarizer/` と分離する。

## Complexity Tracking

該当なし
