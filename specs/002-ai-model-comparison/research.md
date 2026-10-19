# Research: AI モデル比較ページの日次自動更新

## R1. 情報収集の方式

- **Decision**: 既存 `trendGenerator.ts` と同様に `@google/genai`（Vertex AI, ADC 認証）で `gemini-2.5-flash` + `tools: [{ googleSearch: {} }]` を使う
- **Rationale**: 既に本番で動作実績があり、IAM・API 有効化の追加作業が不要。最新情報の取得に検索グラウンディングが必須
- **Alternatives considered**: 公式ドキュメントのスクレイピング（ベンチマーク・他社モデルに対応できない）、外部リーダーボード API（有料・安定性不明）

## R2. 1回の呼び出しか、区分ごとの呼び出しか

- **Decision**: Claude モデル → 話題モデル → ベンチマークの順に3回呼び出す。ベンチマーク呼び出しには前2区分で確定したモデル名一覧を渡す
- **Rationale**: 区分単位で失敗を隔離でき（FR-003 の区分単位フォールバック）、出力トークン上限・JSON 破損リスクも下がる。ベンチマークの列を確定済みモデル名に揃えられる
- **Alternatives considered**: 1回で全取得（1箇所の破損で全区分が失敗、出力が長大）

## R3. 構造化出力

- **Decision**: googleSearch ツールと responseSchema（JSON モード）は併用できないため、プロンプトで JSON のみ出力を指示し、コードブロック除去 → JSON 抽出 → 型検証を行う。失敗時は最大3回リトライ
- **Rationale**: 既存トレンド機能と同じ実績ある方式
- **Alternatives considered**: 検索なしで JSON モード（最新性が失われる）、2段階呼び出し（検索→整形）はコスト・複雑性増

## R4. ベンチマーク値の信頼性（FR-008）

- **Decision**: 各スコアに `sourceUrl` を必須とし、`http:`/`https:` 以外・パース不能 URL・Vertex のグラウンディング中継 URL（`vertexaisearch.cloud.google.com`）のスコアは破棄する。表示側でも URL を再検証し、無効なら「―」
- **Rationale**: 出典なしの数値を表示しない（SC-003）。中継 URL は期限付きで出典として不適
- **Alternatives considered**: 出典 URL への HEAD リクエスト検証（多くのサイトが bot を 403 で拒否し誤検知が多い、実行時間増）→ 採用せず、注意書き（FR-014）で補完

## R5. 初期データとフォールバック

- **Decision**: 現行 `/models` ページの直書きデータを `src/lib/modelComparison.ts` に初期データとして移し、フロントで区分ごとに「API データが空なら初期データ」とする。ベンチマーク・話題モデルの初期データは空（「準備中」表示）
- **Rationale**: API・Firestore 障害時もページが空にならない（SC-004）。出典を検証できないベンチマーク値を手書きで載せない
- **Alternatives considered**: バックエンドに初期データを持たせる（API 障害時に効かない）

## R6. タブ状態と描画方式

- **Decision**: ページはサーバーコンポーネントで `searchParams.tab` を読み、初期タブを決定。3パネルともサーバーで描画し、クライアントの `ModelComparisonTabs` が `hidden` 切替と `history.replaceState` による `?tab=` 更新を担う。WAI-ARIA Tabs パターン（roving tabindex、←/→/Home/End）
- **Rationale**: 直接 URL を開いた時にちらつきがなく、全パネルが SSR されるため SEO にも有利。ページ再読み込み不要（US4-2）
- **Alternatives considered**: `useSearchParams`（Suspense 境界で SSR が失われる）、ハッシュ（サーバーで初期タブを決められない）

## R7. 更新スケジュール

- **Decision**: `onSchedule({ schedule: "0 6 * * *", timeZone: "Asia/Tokyo", timeoutSeconds: 540, memory: "512MiB" })`
- **Rationale**: FR-001。3回の検索付き生成＋リトライに余裕を持たせる
- **Alternatives considered**: `every 24 hours`（実行時刻を固定できない）
