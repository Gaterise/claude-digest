# Quickstart: Claude Digest

**対象**: 開発者セットアップガイド  
**前提**: Node.js 20+、Firebase CLI、Git インストール済み

---

## 1. リポジトリセットアップ

```bash
# 依存関係インストール
npm install

# Firebase Functions 依存関係インストール
cd functions && npm install && cd ..

# 環境変数ファイルの準備
cp .env.example .env.local
# .env.local を編集して各値を設定
```

---

## 2. 環境変数 `.env.local` の設定項目

```bash
# Firebase（フロントエンド公開可）
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=claude-digest
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# API エンドポイント（ローカル: Firebase Emulator）
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/claude-digest/asia-northeast1/api/v1
```

Functions の秘密値は Firebase Secret Manager で管理:
```bash
firebase functions:secrets:set EMAILJS_PRIVATE_KEY
```

---

## 3. ローカル開発の起動

**ターミナル 1: Firebase Emulator**
```bash
npm run emulator
# Firestore + Functions エミュレーター起動
# UI: http://localhost:4000
```

**ターミナル 2: Next.js 開発サーバー**
```bash
npm run dev
# http://localhost:3000
```

**API クライアント生成**（OpenAPI スペックを変更した後）
```bash
npm run generate
# orval が src/generated/api/ を更新
```

---

## 4. テスト実行

```bash
# 単体・統合テスト（Vitest）
npm run test

# E2E テスト（Playwright）
npm run test:e2e

# テストカバレッジ
npm run test:coverage
```

---

## 5. Firebase デプロイ

```bash
# ビルド & フルデプロイ
npm run deploy

# Functions のみデプロイ
firebase deploy --only functions

# Hosting のみデプロイ
firebase deploy --only hosting
```

---

## 6. プロジェクト構造

```
claude_digest/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # トップ（ダイジェスト一覧）SSR
│   │   └── digests/
│   │       └── [id]/
│   │           └── page.tsx      # ダイジェスト詳細 SSR
│   ├── components/               # UI コンポーネント
│   │   ├── DigestCard.tsx
│   │   ├── DigestList.tsx
│   │   ├── DigestDetail.tsx
│   │   └── CategoryBadge.tsx
│   ├── generated/
│   │   └── api/                  # orval 自動生成（編集禁止）
│   ├── lib/
│   │   ├── firebase.ts           # Firebase クライアント初期化
│   │   └── queryClient.ts        # TanStack Query クライアント
│   └── providers/
│       └── QueryProvider.tsx     # TanStack Query プロバイダー
├── functions/
│   ├── src/
│   │   ├── index.ts              # Functions エントリポイント
│   │   ├── scraper/              # 変更ログ取得ロジック
│   │   ├── summarizer/           # AI 要約生成ロジック
│   │   └── api/                  # HTTP エンドポイント
│   └── package.json
├── specs/                        # speckit 仕様書
├── .env.example
├── firebase.json
├── firestore.rules
├── orval.config.ts
├── openapi.yaml                  # → specs/001-claude-digest/contracts/openapi.yaml のシンボリックリンク
└── package.json
```

---

## 7. 主要スクリプト一覧

| コマンド | 内容 |
|---------|------|
| `npm run dev` | Next.js 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run generate` | orval で API クライアント生成 |
| `npm run emulator` | Firebase Emulator 起動 |
| `npm run test` | Vitest 実行 |
| `npm run test:e2e` | Playwright E2E 実行 |
| `npm run deploy` | Firebase 全サービスデプロイ |
| `npm run lint` | ESLint 実行 |
| `npm run typecheck` | TypeScript 型チェック |
