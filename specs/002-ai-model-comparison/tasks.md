# Tasks: AI モデル比較ページの日次自動更新とベンチマーク・話題モデル掲載

**Input**: `/specs/002-ai-model-comparison/` の plan.md, spec.md, data-model.md, contracts/, research.md
**Tests**: 憲章 I（TDD）により必須。テストタスクは実装タスクより先に実施し、Red を確認してユーザー承認後に実装する。

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup / 共通基盤

- [x] T001 functions の型定義に ClaudeModel / Benchmark / BenchmarkScore / TrendingModel / ModelComparison を追加（`functions/src/types/index.ts`）
- [x] T002 [P] フロントの API 型に ModelComparisonResponse 系を追加（`src/generated/api/model/index.ts`）
- [x] T003 [P] `openapi.yaml` に `/model-comparison` と関連スキーマ、`models` タグを追加（contracts/model-comparison.openapi.yaml に準拠）

---

## Phase 2: テスト先行（Red）⚠️ 実装前に失敗を確認しユーザー承認を得る

- [x] T004 [P] [US1][US2][US3] パーサーのユニットテスト（`tests/unit/modelComparison/parser.test.ts`）— JSON 抽出（コードブロック除去）、区分ごとの必須項目検証・件数制約、URL 検証（http/https のみ・中継 URL 拒否）、出典なしスコア破棄、候補外モデル破棄、Claude を含む話題モデル除外
- [x] T005 [P] [US1] 更新オーケストレーションのテスト（`tests/unit/modelComparison/updater.test.ts`）— 全成功で全区分置換、区分失敗で前回データ維持、全失敗で null（書き込みなし）、ベンチマーク生成へ候補モデル名（Claude 優先・最大10）を渡す
- [x] T006 [P] [US1] API レスポンス契約テスト（`tests/integration/api/modelComparison.test.ts`）— スナップショット → ModelComparisonResponse 変換、未生成時は空配列・null
- [x] T007 [P] [US1] フロントロジックのテスト（`tests/unit/lib/modelComparison.test.ts`）— 区分単位の初期データフォールバック、`parseTab`、`isSafeHttpUrl`、`findBestScore`（higherIsBetter 対応）、日付整形
- [x] T008 [P] [US4] タブのテスト（`tests/unit/components/ModelComparisonTabs.test.tsx`）— 初期タブ、クリック切替で `?tab=` 更新、矢印/Home/End キー操作、ARIA 属性
- [x] T009 [P] [US1] Claude パネルのテスト（`tests/unit/components/ClaudeModelsPanel.test.tsx`）— カード・スペック表・使い分けガイド・注記
- [x] T010 [P] [US2] ベンチマークパネルのテスト（`tests/unit/components/BenchmarkPanel.test.tsx`）— 表の行列、出典リンク（新しいタブ・noopener）、欠損セル「―」、最高値強調、空時「準備中」
- [x] T011 [P] [US3] 話題モデルパネルのテスト（`tests/unit/components/TrendingModelsPanel.test.tsx`）— カード項目、公式リンク、不正 URL 非表示、空時「準備中」
- [x] T012 [P] [US4] E2E（`tests/e2e/models.spec.ts`）— タブ切替と URL 直接アクセス、モバイル幅で横はみ出しなし

**Checkpoint**: 全テストが Red であることを確認 → ユーザー承認

---

## Phase 3: User Story 1 - 常に最新の Claude モデル情報（P1）🎯 MVP

- [x] T013 [US1] パーサー実装（`functions/src/modelComparison/parser.ts`）→ T004 Green
- [x] T014 [US1] 更新オーケストレーション実装（`functions/src/modelComparison/updater.ts`）→ T005 Green
- [x] T015 [US1] Gemini 生成実装（`functions/src/modelComparison/generator.ts`）— 3区分のプロンプト、googleSearch、最大3回リトライ
- [x] T016 [US1] Firestore リポジトリ（`functions/src/firestore/modelComparisonRepository.ts`）
- [x] T017 [US1] スケジューラー（`functions/src/modelComparison/scheduler.ts`、毎日 06:00 Asia/Tokyo）と `functions/src/index.ts` への export
- [x] T018 [US1] レスポンス変換（`functions/src/modelComparison/response.ts`）とルート（`functions/src/api/routes/modelComparison.ts`）、`functions/src/api/index.ts` 登録 → T006 Green
- [x] T019 [US1] API クライアントに `getModelComparison` 追加（`src/generated/api/claudeDigestAPI.ts`）
- [x] T020 [US1] 初期データ・フォールバック等のロジック（`src/lib/modelComparison.ts`）→ T007 Green
- [x] T021 [US1] Claude パネル（`src/components/models/ClaudeModelsPanel.tsx`）→ T009 Green

## Phase 4: User Story 4 - タブ切替（P2）

- [x] T022 [US4] タブ（`src/components/models/ModelComparisonTabs.tsx`）→ T008 Green
- [x] T023 [US4] ページ刷新（`src/app/models/page.tsx`）— searchParams から初期タブ、API 取得 + フォールバック、最終更新日、注意書き

## Phase 5: User Story 2 - ベンチマーク比較（P2）

- [x] T024 [US2] ベンチマークパネル（`src/components/models/BenchmarkPanel.tsx`）→ T010 Green

## Phase 6: User Story 3 - 話題の AI モデル（P3）

- [x] T025 [US3] 話題モデルパネル（`src/components/models/TrendingModelsPanel.tsx`）→ T011 Green

## Phase 7: Polish

- [x] T026 [P] サイトマップの changeFrequency を daily に（`src/app/sitemap.ts`）
- [x] T027 全ユニット/統合テスト、`npm run typecheck`、`npm run lint`、`npm run build`、`npm --prefix functions run build` を実行
- [x] T028 quickstart.md に沿った手動確認（dev サーバーで 3 タブ・モバイル幅）

## Phase 8: ページ分割（2026-10-19 変更）

- [x] T029 テスト先行: `tests/unit/lib/modelComparison.test.ts`（AI_MODEL_TABS・既定 trending・ページ別更新日時）、`tests/unit/components/ModelComparisonTabs.test.tsx`（2タブ）、`tests/e2e/models.spec.ts`（2ページ・旧 URL リダイレクト・3点メニュー）を更新し Red を確認 → 承認
- [x] T030 `src/lib/modelComparison.ts`: AI_MODEL_TABS / DEFAULT_TAB=trending、claudeUpdatedAt / aiModelsUpdatedAt
- [x] T031 `ModelPageHero`（ヒーロー・件数ストリップ・注意書き）を共通化、`src/app/fonts.ts` に等幅フォント
- [x] T032 `/models` を Claude モデル専用に、旧 `?tab=` を `/ai-models` へ恒久リダイレクト
- [x] T033 `/ai-models`「話題の AI 比較」ページを新設（話題の AI モデル〔既定〕/ ベンチマーク比較）
- [x] T034 ヘッダー3点メニュー・フッター・サイトマップに2ページを反映
- [x] T035 全テスト・typecheck・build・E2E を実行

## Phase 9: 本番不具合修正（2026-10-19）ベンチマーク生成が 0 件になる

原因: 検索グラウンディング付き Gemini は出典を `vertexaisearch.cloud.google.com/grounding-api-redirect/...`（中継 URL）でしか返さず、パーサーが出典なしとして全スコアを破棄していた。長い中継 URL の転記で JSON が崩れることもあった。

- [x] T036 テスト先行: `tests/unit/modelComparison/sourceResolver.test.ts`、`parser.test.ts`（JSON 修復・エラー周辺の原文）→ Red 確認 → 承認
- [x] T037 `functions/src/modelComparison/sourceResolver.ts`: 中継 URL を HEAD（redirect: manual）で解決し実 URL に置換
- [x] T038 `extractJson` に jsonrepair によるフォールバックとエラー周辺の原文出力
- [x] T039 generator で応答テキストの出典 URL を解決してからパース、scheduler の timeoutSeconds を 900 に
- [x] T040 実際の Gemini 応答で検証（ベンチマーク 0 件 → 5 件、URL 解決 33/39 件）

## Dependencies

- T001–T003 → Phase 2 → 承認 → Phase 3（T013→T014→T015〜T018）
- T020 → T021, T022–T025
- T023 は T021・T022・T024・T025 のパネルを組み込む（T024/T025 未完了時は空パネルで先行可）
