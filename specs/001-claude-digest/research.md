# Research: Claude Digest

**Feature**: 001-claude-digest  
**Date**: 2026-04-14  
**Status**: Complete — 全 NEEDS CLARIFICATION 解消済み

---

## 1. Claude 公式変更ログの取得元

### Decision
Anthropic の公式ドキュメントサイト `https://docs.anthropic.com/en/release-notes/overview` をスクレイピングおよびポーリングで取得する。

### Rationale
- 公式 RSS/Atom フィードは2026年4月時点で提供されていない
- HTML ページを定期取得（Cloud Scheduler + Cloud Run Functions または Firebase Scheduled Extensions）し、前回取得分との差分を検出して新しいエントリを識別する
- スクレイピング対象の HTML 構造は比較的安定しており、変更検知が容易
- Anthropic が将来的に公式 API や RSS を提供した場合は切り替え可能な設計とする

### Alternatives Considered
| 案 | 評価 |
|----|------|
| RSS フィード | 2026年4月時点では提供なし → 却下 |
| GitHub Release Notes (anthropic-sdk) | SDK の変更であり Claude Code 変更ログと乖離 → 補助的に使用 |
| Twitter/X API モニタリング | 有料 API、信頼性低い → 却下 |
| 手動入力 | リアルタイム要件を満たさない → 却下 |

---

## 2. Next.js バージョン選定

### Decision
**Next.js 15.3.9**（`next-15-3` dist-tag の最新）を採用する。

### Rationale
- `latest` タグの 16.2.3 は執筆時点で安定版として扱われているが、Next.js 16 はメジャーバージョンアップであり、Firebase Hosting の Next.js アダプター・orval・TanStack Query との互換性が未検証
- **Next.js 15.3.9** は LTS 扱いのパッチ安定版であり、Firebase Hosting の Next.js SSR サポート（`firebase.json` の `rewrites` + Cloud Run）が実績豊富
- App Router が成熟しており、RSC（React Server Components）による SSR が推奨パターン

### Alternatives Considered
| 案 | 評価 |
|----|------|
| Next.js 16.2.3 (latest) | Firebase Hosting との SSR 互換性未検証、採用事例少 → 見送り |
| Next.js 14 | App Router は安定しているが 15 系が既に安定 → 不要 |
| Next.js 15.3.9 | ✅ 採用 |

---

## 3. Firebase 構成

### Decision
| サービス | 用途 |
|----------|------|
| Firebase Hosting | Next.js SSR ホスティング（Cloud Run 経由） |
| Firestore | ダイジェスト記事・変更ログメタデータの永続化 |
| Cloud Storage (Firebase Storage) | 将来的な画像・添付ファイル保存（v1ではほぼ不使用） |
| Firebase Functions (第2世代) | 定期ポーリング・AI 要約生成の バックエンドロジック |
| Firebase Authentication | v1スコープ外（通知機能実装時に追加） |

### Rationale
- Firebase Hosting の Next.js フレームワーク対応（`firebase.json` の `frameworksBackend`）により、App Router の SSR/SSG が透過的にデプロイ可能
- Firestore はリアルタイムリスナーが内蔵されており、将来のリアルタイム更新通知への拡張が容易
- 全てのサービスが同一 GCP プロジェクトで管理でき運用が単純

### Alternatives Considered
| 案 | 評価 |
|----|------|
| Vercel + Supabase | Firebase 指定のため対象外 |
| Firebase Realtime Database | ドキュメント構造が複雑、Firestore が適切 → 却下 |

---

## 4. orval + OpenAPI Spec による API クライアント生成

### Decision
- `orval@8.7.0` + `@tanstack/react-query@5.99.0` の組み合わせを採用
- `openapi.spec.yaml` を `specs/001-claude-digest/contracts/openapi.yaml` に配置
- Firebase Functions の HTTP エンドポイントを OpenAPI で定義し、orval で TanStack Query hooks を自動生成
- 生成先: `src/generated/api/`

### Rationale
- orval の `react-query` モードにより、`useGetDigests()` などの型付き hooks が自動生成され、手動 fetch コードが不要になる
- `openapi.yaml` がコントラクトとして機能し、フロントエンド・バックエンド間の型ズレを防ぐ
- orval は `orval.config.ts` ファイルで設定管理し、`npm run generate` で再生成可能

### Alternatives Considered
| 案 | 評価 |
|----|------|
| openapi-typescript-codegen | 更新頻度低下 → 却下 |
| swagger-typescript-api | orval より設定が複雑 → 却下 |
| 手動型定義 | コントラクトとの乖離リスク → 却下 |

---

## 5. AI 要約・翻訳の実装方針

### Decision
Firebase Functions 内で **Anthropic Claude API（claude-3-5-haiku）** を呼び出して変更ログを日本語要約する。

### Rationale
- claude-3-5-haiku は高速・低コストで要約タスクに適している
- Firebase Functions の秘密情報は Firebase Secret Manager で管理（`.env` ファイルは Functions では使用不可のため、ローカル開発は `.env.local`）
- Next.js フロントエンド側の環境変数は `.env.local` / `.env.production` で管理

### Alternatives Considered
| 案 | 評価 |
|----|------|
| OpenAI GPT-4o | コスト高、Claude アプリなので Anthropic API を優先 → 却下 |
| Google Gemini | Firebase との親和性高いが Claude 品質を優先 → 将来検討 |
| ローカル LLM | Functions 環境では現実的でない → 却下 |

---

## 6. テスト戦略（Constitution I, IV 準拠）

### Decision
| テスト種別 | ツール | 対象 |
|-----------|--------|------|
| 単体テスト | Vitest + React Testing Library | コンポーネント・ユーティリティ関数 |
| 統合テスト | Vitest + Firebase Emulator Suite | Firestore 操作・Functions ロジック |
| E2E テスト | Playwright | 主要ユーザーストーリー（P1, P2） |
| OpenAPI コントラクトテスト | orval 生成型 + Vitest | API コントラクト検証 |

### Rationale
- Firebase Emulator Suite を使えば実 Firebase に依存せずローカルで統合テスト可能
- Vitest は Next.js 15 との相性が良く、Vite 系エコシステムと統合しやすい
- Playwright は Next.js 15 の `@playwright/test` peer dependency として明示されている

---

## 7. 環境変数管理

### Decision
```
.env.local          # ローカル開発用（Gitignore対象）
.env.development    # 開発環境
.env.production     # 本番環境（Gitignore対象、CI/CDで注入）
.env.example        # サンプル（Git管理対象）
```

### Rationale
- Next.js の標準環境変数ロード順序に準拠
- `NEXT_PUBLIC_` プレフィックス付き変数のみブラウザに公開
- Firebase Functions の秘密値は `firebase functions:secrets:set` で管理し、Functions 内は `process.env` で参照

---

## 8. プロジェクト構造の決定

### Decision
**Next.js App Router モノレポ（単一プロジェクト）** + Firebase Functions をサブディレクトリで管理する。

```
claude_digest/
├── src/                          # Next.js App Router ソース
├── functions/                    # Firebase Functions（Node.js）
├── specs/                        # speckit 仕様書
└── firebase.json / .firebaserc   # Firebase 設定
```

### Rationale
- Firebase CLI は `functions/` ディレクトリをデフォルトで認識
- Next.js と Functions が別リポジトリになるとデプロイ・開発フローが複雑になる（YAGNI: Constitution V）
- `functions/` は独立した `package.json` を持ち、Node.js 20 で動作
