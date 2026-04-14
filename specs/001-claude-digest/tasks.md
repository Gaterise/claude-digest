# Tasks: Claude Digest

**Input**: Design documents from `/specs/001-claude-digest/`  
**Branch**: `001-claude-digest`  
**Date**: 2026-04-14  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/openapi.yaml ✅ quickstart.md ✅

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 並列実行可能（異なるファイル、未完了タスクへの依存なし）
- **[Story]**: 対応ユーザーストーリー（US1=P1, US2=P2, US3=P3）
- 各説明に正確なファイルパスを含む

---

## Phase 1: Setup（プロジェクト初期化）

**目的**: Next.js + Firebase + orval + テストツールの初期設定

- [ ] T001 Next.js 15.3.9 プロジェクトを App Router・TypeScript・Tailwind CSS で初期化する（`package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/globals.css`）
- [ ] T002 Firebase CLI でプロジェクトを初期化し Firebase Functions（第2世代）・Firestore・Hosting を設定する（`firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`）
- [ ] T003 [P] `functions/` ディレクトリを Node.js 20 + TypeScript で初期化する（`functions/package.json`, `functions/tsconfig.json`）
- [ ] T004 [P] Vitest・React Testing Library・Firebase Emulator テスト環境を設定する（`vitest.config.ts`, `tests/` ディレクトリ構造作成）
- [ ] T005 [P] Playwright を設定する（`playwright.config.ts`, `tests/e2e/` ディレクトリ作成）
- [ ] T006 [P] orval を設定し openapi.yaml から API クライアントの生成パイプラインを構築する（`orval.config.ts`, `openapi.yaml`, `src/generated/api/` ディレクトリ）
- [ ] T007 [P] `.env.example` を作成し全必要環境変数をドキュメント化する（`.env.example`）
- [ ] T008 `.gitignore` に `.env.local`, `.env.production`, `src/generated/api/` 以外の生成ファイルを追加する（`.gitignore`）

**Checkpoint**: `npm run dev`、`npm run emulator`、`npm run generate` が正常起動すること

---

## Phase 2: Foundational（基盤 — 全ストーリーのブロッカー）

**目的**: 全ユーザーストーリーが依存するコアインフラを構築する

**⚠️ CRITICAL**: このフェーズ完了前にいかなるユーザーストーリーも開始できない

### テスト（先に書いて失敗を確認すること）

- [ ] T009 [P] Firestore セキュリティルールの統合テストを作成する（`tests/integration/firestore/security-rules.test.ts`）— 未実装のルールに対して失敗することを確認
- [ ] T010 [P] Firebase クライアント初期化のユニットテストを作成する（`tests/unit/lib/firebase.test.ts`）— 未実装に対して失敗することを確認
- [ ] T011 [P] TanStack Query クライアント設定のユニットテストを作成する（`tests/unit/lib/queryClient.test.ts`）— 未実装に対して失敗することを確認

### 実装

- [ ] T012 [P] Firebase クライアント初期化モジュールを実装する（`src/lib/firebase.ts`）— `NEXT_PUBLIC_FIREBASE_*` 環境変数を使用、T010 のテストを通過させる
- [ ] T013 [P] TanStack Query クライアントと Hydration プロバイダーを実装する（`src/lib/queryClient.ts`, `src/providers/QueryProvider.tsx`）— T011 のテストを通過させる
- [ ] T014 orval で `openapi.yaml` から API クライアント・型定義・TanStack Query hooks を生成する（`src/generated/api/`）— T006 の設定に依存
- [ ] T015 [P] Firestore セキュリティルールを実装する（`firestore.rules`）— 読み取り公開・書き込みは Admin SDK のみ、T009 のテストを通過させる
- [ ] T016 [P] Firestore 複合インデックスを定義する（`firestore.indexes.json`）— data-model.md のインデックス要件に従う
- [ ] T017 [P] Functions 用共通型定義を実装する（`functions/src/types/index.ts`）— `ChangeLog`, `DigestArticle`, `DigestCategory` インターフェース
- [ ] T018 [P] ChangeLog Firestore リポジトリを実装する（`functions/src/firestore/changeLogRepository.ts`）— CRUD 操作・contentHash 重複チェック（FR-010）
- [ ] T019 [P] DigestArticle Firestore リポジトリを実装する（`functions/src/firestore/digestRepository.ts`）— 公開済み記事の一覧取得・ID 取得・カーソルページネーション
- [ ] T020 Next.js ルートレイアウトと共通型定義を実装する（`src/app/layout.tsx`, `src/types/index.ts`）— QueryProvider を組み込む

**Checkpoint**: Firestore Emulator でリポジトリのテストが全て通過すること・`npm run generate` で型付き hooks が生成されること

---

## Phase 3: User Story 1 — 最新ダイジェスト記事の閲覧（Priority: P1）🎯 MVP

**Goal**: ユーザーがアプリにアクセスすると Claude の最新変更点が日本語ダイジェスト記事として一覧表示され、詳細も読める（FR-001〜006, FR-010）

**Independent Test**: `npm run dev` 起動後に `http://localhost:3000` でダイジェスト一覧が SSR で表示される。一覧の記事をクリックすると詳細ページに遷移し、日本語要約・重要ポイント・公式リンクが確認できる。

### テスト（先に書いて失敗を確認すること）

- [ ] T021 [P] [US1] Functions API `/health` エンドポイントのコントラクトテストを作成する（`tests/integration/api/health.test.ts`）— OpenAPI spec に準拠したレスポンス形式を検証
- [ ] T022 [P] [US1] Functions API `GET /digests` エンドポイントのコントラクトテストを作成する（`tests/integration/api/listDigests.test.ts`）— レスポンス型・ページネーション・空リストを検証
- [ ] T023 [P] [US1] Functions API `GET /digests/:id` エンドポイントのコントラクトテストを作成する（`tests/integration/api/getDigestById.test.ts`）— 正常系・404 を検証
- [ ] T024 [P] [US1] スクレイパーのユニットテストを作成する（`tests/unit/scraper/anthropicScraper.test.ts`）— HTML パース・contentHash 生成・重複検知ロジックを検証
- [ ] T025 [P] [US1] AI 要約生成のユニットテストを作成する（`tests/unit/summarizer/claudeSummarizer.test.ts`）— Anthropic API をモックして要約構造・カテゴリ分類を検証
- [ ] T026 [P] [US1] `DigestCard` コンポーネントのユニットテストを作成する（`tests/unit/components/DigestCard.test.tsx`）— タイトル・keyPoints・カテゴリバッジ・日付表示を検証
- [ ] T027 [P] [US1] `DigestDetail` コンポーネントのユニットテストを作成する（`tests/unit/components/DigestDetail.test.tsx`）— summary・keyPoints・sourceUrl リンクを検証
- [ ] T028 [P] [US1] ダイジェスト一覧 E2E テストを作成する（`tests/e2e/digest-list.spec.ts`）— 一覧表示・記事クリック→詳細遷移を検証（Playwright）
- [ ] T029 [P] [US1] ダイジェスト詳細 E2E テストを作成する（`tests/e2e/digest-detail.spec.ts`）— 詳細コンテンツ表示・公式リンクを検証（Playwright）

### 実装：Functions バックエンド

- [ ] T030 [P] [US1] Anthropic 変更ログスクレイパーを実装する（`functions/src/scraper/anthropicScraper.ts`）— `https://docs.anthropic.com/en/release-notes/overview` の HTML を取得・パース・contentHash 生成（FR-001, FR-010）、T024 のテストを通過させる
- [ ] T031 [P] [US1] Claude API を使った日本語要約・カテゴリ分類ロジックを実装する（`functions/src/summarizer/claudeSummarizer.ts`）— claude-3-5-haiku を使って `title`, `summary`, `keyPoints`, `categories` を生成（FR-002, FR-008）、T025 のテストを通過させる
- [ ] T032 [US1] Cloud Scheduler トリガーによる定期ポーリング Function を実装する（`functions/src/scraper/scheduler.ts`）— 30分ごとに scraper を実行・diff 検知・pending ChangeLog を Firestore に保存（FR-006）。T030, T031 に依存
- [ ] T033 [US1] Express + HTTP Function で API ルーターを実装する（`functions/src/api/index.ts`, `functions/src/api/middleware/errorHandler.ts`）— CORS・エラーハンドリング含む
- [ ] T034 [US1] `GET /health` エンドポイントを実装する（`functions/src/api/routes/health.ts`）— T021 のテストを通過させる
- [ ] T035 [US1] `GET /digests` エンドポイントを実装する（`functions/src/api/routes/digests.ts`）— digestRepository から公開済み記事を取得・カーソルページネーション（FR-003）、T022 のテストを通過させる
- [ ] T036 [US1] `GET /digests/:id` エンドポイントを実装する（`functions/src/api/routes/digests.ts`）— ID で詳細取得・404 ハンドリング（FR-004）、T023 のテストを通過させる
- [ ] T037 [US1] Functions エントリポイントで全 Function を export する（`functions/src/index.ts`）— scheduler・api HTTP function を公開

### 実装：フロントエンド UI

- [ ] T038 [P] [US1] `CategoryBadge` UI コンポーネントを Tailwind CSS で実装する（`src/components/CategoryBadge.tsx`）— カテゴリ別の色分けバッジ
- [ ] T039 [P] [US1] `Loading` UI コンポーネントを Tailwind CSS で実装する（`src/components/ui/Loading.tsx`）— スケルトンローディング表示
- [ ] T040 [P] [US1] `DigestCard` コンポーネントを Tailwind CSS で実装する（`src/components/DigestCard.tsx`）— タイトル・keyPoints 3件・カテゴリバッジ・日付表示、T026 のテストを通過させる
- [ ] T041 [US1] `DigestDetail` コンポーネントを Tailwind CSS で実装する（`src/components/DigestDetail.tsx`）— summary（Markdown レンダリング）・keyPoints・sourceUrl リンク、T027 のテストを通過させる。T038 に依存
- [ ] T042 [US1] ダイジェスト一覧 SSR ページを実装する（`src/app/page.tsx`）— Server Component で生成された API 関数を直接呼び出し、`revalidate: 60` で ISR、T028 の E2E テストを通過させる。T035, T040 に依存
- [ ] T043 [US1] ダイジェスト詳細 SSR ページを実装する（`src/app/digests/[id]/page.tsx`）— Server Component・`generateMetadata` で OGP 設定・`revalidate: 300`、T029 の E2E テストを通過させる。T036, T041 に依存

**Checkpoint**: `npm run test` + `npm run test:e2e` が全て通過すること。`http://localhost:3000` で一覧・詳細が SSR で表示されること。これで **MVP** が成立する。

---

## Phase 4: User Story 2 — 変更履歴の検索・フィルタリング（Priority: P2）

**Goal**: ユーザーがカテゴリ・日付範囲でダイジェスト記事を絞り込んで確認できる（FR-007, FR-008）

**Independent Test**: 一覧ページで「新機能」カテゴリを選択すると該当記事のみ表示される。日付範囲を指定すると期間内の記事のみ表示される。フィルタ解除で全件に戻る。

### テスト（先に書いて失敗を確認すること）

- [ ] T044 [P] [US2] `GET /digests` のカテゴリ・日付フィルタパラメータのコントラクトテストを作成する（`tests/integration/api/listDigestsFilter.test.ts`）— `category`, `from`, `to` クエリパラメータを検証
- [ ] T045 [P] [US2] `CategoryFilter` コンポーネントのユニットテストを作成する（`tests/unit/components/CategoryFilter.test.tsx`）— 選択状態の変化・コールバック呼び出しを検証
- [ ] T046 [P] [US2] `DigestList` コンポーネントのユニットテストを作成する（`tests/unit/components/DigestList.test.tsx`）— フィルタ UI 表示・フィルタ適用後の記事リスト変化を検証
- [ ] T047 [P] [US2] フィルタリング E2E テストを作成する（`tests/e2e/digest-filter.spec.ts`）— カテゴリ選択・日付範囲入力・絞り込み結果を Playwright で検証

### 実装：Functions バックエンド

- [ ] T048 [US2] `GET /digests` エンドポイントにカテゴリ・日付フィルタを追加する（`functions/src/api/routes/digests.ts`）— `category`, `from`, `to` クエリパラメータを受け取り digestRepository に渡す、T044 のテストを通過させる
- [ ] T049 [US2] `digestRepository.listPublished()` にフィルタオプションを追加する（`functions/src/firestore/digestRepository.ts`）— Firestore 複合クエリで category・publishedAt 範囲フィルタを実装

### 実装：フロントエンド UI

- [ ] T050 [P] [US2] `CategoryFilter` コンポーネントを Tailwind CSS で実装する（`src/components/CategoryFilter.tsx`）— カテゴリ選択 UI、T045 のテストを通過させる
- [ ] T051 [US2] `DigestList` コンポーネントを Tailwind CSS で実装する（`src/components/DigestList.tsx`）— CategoryFilter + 日付範囲 UI を含む。`useListDigests()` orval hooks でクライアントサイドフィルタリング（TanStack Query）、T046 のテストを通過させる。T050 に依存
- [ ] T052 [US2] トップページにフィルタリング機能を統合する（`src/app/page.tsx`）— SSR で初期データを取得し Client Component として `DigestList` を使用、T047 の E2E テストを通過させる。T051 に依存

**Checkpoint**: `npm run test` + `npm run test:e2e` が全て通過すること。カテゴリ・日付フィルタが動作すること。US1 も引き続き動作すること。

---

## Phase 5: User Story 3 — 新しいダイジェストの通知受信（Priority: P3）

**Goal**: ユーザーが新しいダイジェスト公開時に通知を受け取れる設定ができる（FR-009）

> ⚠️ **注意**: spec.md で「v1スコープ外」と定義されている。このフェーズは v1 後に実施する。v1 MVP は Phase 1〜4 で完成する。

**Independent Test**: 通知設定を有効にしているユーザーに、新規ダイジェスト生成時にメール通知が届く。通知から該当記事に直接遷移できる。

### テスト（先に書いて失敗を確認すること）

- [ ] T053 [P] [US3] NotificationSetting Firestore リポジトリのユニットテストを作成する（`tests/unit/firestore/notificationRepository.test.ts`）
- [ ] T054 [P] [US3] 通知送信ロジックのユニットテストを作成する（`tests/unit/notifications/notificationService.test.ts`）— 通知サービスをモックして呼び出しを検証

### 実装

- [ ] T055 [P] [US3] `NotificationSetting` Firestore コレクション定義とリポジトリを実装する（`functions/src/firestore/notificationRepository.ts`）— T053 のテストを通過させる
- [ ] T056 [US3] 通知サービスを実装する（`functions/src/notifications/notificationService.ts`）— 新規 DigestArticle 公開時に通知設定ユーザーへ送信（Firebase Extension または外部メールサービス経由）、T054 のテストを通過させる。T055 に依存
- [ ] T057 [US3] ダイジェスト生成パイプラインに通知トリガーを組み込む（`functions/src/scraper/scheduler.ts`）— 新規記事公開後に notificationService を呼び出す。T056 に依存
- [ ] T058 [P] [US3] 通知設定 UI を Tailwind CSS で実装する（`src/components/NotificationToggle.tsx`）— ユーザーが通知オン/オフを切り替えられる
- [ ] T059 [US3] 通知設定ページを実装する（`src/app/settings/page.tsx`）— T058 に依存

**Checkpoint**: 新規ダイジェスト生成後に設定ユーザーに通知が届くこと。US1・US2 も引き続き動作すること。

---

## Phase 6: Polish & Cross-Cutting Concerns（横断的改善）

**目的**: 全ストーリーにまたがる品質・UX 向上

- [ ] T060 [P] エラーバウンダリとエラーページを実装する（`src/app/error.tsx`, `src/app/not-found.tsx`）— Tailwind CSS でスタイリング
- [ ] T061 [P] レスポンシブデザインの検証とモバイル対応を完成させる（`src/components/` 全コンポーネント）— Tailwind CSS ブレークポイントを確認
- [ ] T062 [P] OGP メタデータと `robots.txt`, `sitemap.xml` を設定する（`src/app/layout.tsx`, `src/app/sitemap.ts`, `public/robots.txt`）
- [ ] T063 [P] Firebase Hosting のキャッシュヘッダーと CDN 設定を最適化する（`firebase.json`）
- [ ] T064 [P] `.env.example` の最終レビューと README.md の作成（`README.md`, `.env.example`）— quickstart.md の内容を統合
- [ ] T065 `quickstart.md` のシナリオで E2E テストを実行してローカル開発フローを検証する（`tests/e2e/`）
- [ ] T066 [P] TypeScript strict モードで型エラーが 0 件であることを確認する（`npm run typecheck`）
- [ ] T067 [P] ESLint エラーが 0 件であることを確認する（`npm run lint`）

---

## Dependencies & Execution Order

### フェーズ依存関係

- **Phase 1（Setup）**: 依存なし — 即座に開始可能
- **Phase 2（Foundational）**: Phase 1 完了後 — **全ユーザーストーリーをブロック**
- **Phase 3（US1 P1）**: Phase 2 完了後 — MVP の核心
- **Phase 4（US2 P2）**: Phase 3 完了後（US1 UI との統合のため）
- **Phase 5（US3 P3）**: Phase 2 完了後（ただし v1 スコープ外）
- **Phase 6（Polish）**: Phase 3〜4 完了後

### ユーザーストーリー依存関係

- **US1（P1）**: Foundational 完了後に独立して実装・テスト可能
- **US2（P2）**: US1 の UI コンポーネントを拡張するため US1 後が望ましい
- **US3（P3）**: Foundational 完了後に独立実装可能（v1スコープ外）

### 各ユーザーストーリー内の順序

1. テスト作成（失敗確認） → 2. バックエンド（Functions）→ 3. フロントエンド UI → 4. SSR ページ統合

### 並列実行の機会

- Phase 1 の `[P]` タスクは全て並列実行可能
- Phase 2 完了後、US1 のバックエンドとフロントエンドは `[P]` タスクを並列実行可能
- US1 完了後、US2 のバックエンド（T048-T049）とフロントエンド（T050）は並列実行可能

---

## Parallel Example: User Story 1（バックエンド + フロントエンド）

```bash
# Phase 3 テスト（並列作成可能）
Task T021: "Functions API /health コントラクトテスト"
Task T024: "スクレイパーユニットテスト"
Task T025: "AI 要約ユニットテスト"
Task T026: "DigestCard ユニットテスト"
Task T028: "ダイジェスト一覧 E2E テスト"

# Functions バックエンド（T021-T025 失敗確認後、並列実装可能）
Task T030: "anthropicScraper.ts 実装"
Task T031: "claudeSummarizer.ts 実装"
Task T038: "CategoryBadge.tsx 実装"
Task T039: "Loading.tsx 実装"
```

---

## Implementation Strategy

### MVP First（Phase 1〜3 のみ）

1. Phase 1 完了: プロジェクト初期化
2. Phase 2 完了: Firestore・Firebase・orval 基盤（**必須ブロッカー**）
3. Phase 3 完了: US1 — ダイジェスト閲覧
4. **STOP & VALIDATE**: `http://localhost:3000` で一覧・詳細が動作することを確認
5. Firebase Hosting にデプロイして MVP リリース

### Incremental Delivery

| ステップ | フェーズ | 価値 |
|---------|---------|------|
| 1 | Phase 1 + 2 | 開発環境・基盤完成 |
| 2 | Phase 3（US1）| **MVP** — 日本語ダイジェスト閲覧が可能 |
| 3 | Phase 4（US2）| フィルタリング — 記事増加後に価値が出る |
| 4 | Phase 5（US3）| 通知 — v1 後のエンハンスメント |
| 5 | Phase 6 | ポリッシュ・本番品質 |

---

## Notes

- `[P]` タスクは異なるファイルを扱うため並列実行可能
- `[USn]` ラベルはタスクとユーザーストーリーのトレーサビリティを保証する
- **TDD 厳守（Constitution I）**: テストは必ず先に書き、失敗（Red）を確認してから実装する
- `src/generated/api/` は orval 自動生成のため手動編集禁止 — `npm run generate` で再生成すること
- Functions の秘密値（`ANTHROPIC_API_KEY`）は `.env` ではなく Firebase Secret Manager で管理する
- 各タスクまたは論理グループ完了後に git commit すること
- 各フェーズの Checkpoint で独立テストを実行して確認すること
