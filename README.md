# Claude Digest

Claude の公式変更ログを日本語でわかりやすくまとめたダイジェスト記事を提供する Web アプリケーション。

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js 15.3.9 (App Router, SSR) + Tailwind CSS |
| バックエンド | Firebase Functions 第2世代 (Node.js 20) |
| データベース | Firestore |
| AI 要約 | Anthropic Claude API (claude-3-5-haiku) |
| API 定義 | OpenAPI 3.0 + orval (TanStack Query hooks 自動生成) |
| テスト | Vitest + React Testing Library + Playwright |
| デプロイ | Firebase Hosting |

## セットアップ

```bash
# 依存関係インストール
npm install
cd functions && npm install && cd ..

# 環境変数ファイル準備
cp .env.example .env.local
# .env.local を編集して Firebase/Anthropic の値を設定
```

## 開発

```bash
# Next.js 開発サーバー
npm run dev

# Firebase Emulator Suite
npm run emulator

# API クライアント再生成（openapi.yaml 変更後）
npm run generate
```

## テスト

```bash
# 単体・統合テスト
npm run test

# E2E テスト
npm run test:e2e

# 型チェック
npm run typecheck

# ESLint
npm run lint
```

## デプロイ

```bash
# フルデプロイ
npm run deploy

# Functions のみ
firebase deploy --only functions

# Hosting のみ
firebase deploy --only hosting
```

## プロジェクト構造

```
src/
  app/              # Next.js App Router (SSR ページ)
  components/       # React コンポーネント (Tailwind CSS)
  generated/api/    # API クライアント (openapi.yaml ベース)
  lib/              # Firebase 初期化, TanStack Query 設定
  providers/        # React Context プロバイダー
  types/            # 共通型定義
functions/
  src/
    api/            # HTTP エンドポイント (Express)
    scraper/        # 変更ログスクレイパー + スケジューラー
    summarizer/     # Claude API 要約生成
    firestore/      # Firestore リポジトリ
    notifications/  # FCM プッシュ通知送信
tests/
  unit/             # Vitest 単体テスト
  integration/      # 統合テスト (Firebase Emulator)
  e2e/              # Playwright E2E テスト
```

## プッシュ通知

変更ログの更新を FCM (Firebase Cloud Messaging) の Web Push で通知する。

- 未設定のユーザーにはトップページに案内バナーを表示し、「通知を受け取る」で
  通知許可の取得 → FCM トークン発行 → `POST /v1/notifications/subscribe` で
  トピック `changelog-updates` への購読登録を行う
- スケジューラーが新規ダイジェスト記事を公開したタイミングで、トピック購読者
  全員にプッシュ通知を送信する（`functions/src/notifications/notificationSender.ts`）
- 有効化には `NEXT_PUBLIC_FIREBASE_VAPID_KEY` の設定が必要
  （Firebase Console > プロジェクトの設定 > Cloud Messaging > Web Push 証明書 で生成）

## ライセンス

Private
