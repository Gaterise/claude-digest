# Data Model: Claude Digest

**Feature**: 001-claude-digest  
**Date**: 2026-04-14  
**Storage**: Firestore

---

## Entities

### 1. `change_logs` コレクション

GitHub Releases API から取得した生の変更ログエントリ。

```typescript
interface ChangeLog {
  id: string;                   // Firestore doc ID（自動生成）
  sourceUrl: string;            // GitHub Release ページURL（例: https://github.com/anthropics/claude-code/releases/tag/v2.1.107）
  rawContent: string;           // GitHub Release の body（Markdown形式）
  tagName: string;              // GitHub リリースタグ（例: "v2.1.107"）
  version: string | null;       // バージョン番号（tagName から抽出、例: "2.1.107", null if not semver）
  publishedAt: Timestamp;       // GitHub Release の published_at（公開日時）
  fetchedAt: Timestamp;         // システムが取得した日時
  contentHash: string;          // SHA-256 ハッシュ（重複検知用）
  status: 'pending' | 'processing' | 'processed' | 'error';
  errorMessage: string | null;  // status=error 時のエラー詳細
}
```

**バリデーション**:
- `contentHash` は一意制約（重複取得防止）
- `sourceUrl` は必須

**インデックス**:
- `fetchedAt DESC` — 最新取得順
- `status, fetchedAt ASC` — 未処理キュー用

---

### 2. `digest_articles` コレクション

AI が生成した日本語ダイジェスト記事。

```typescript
interface DigestArticle {
  id: string;                    // Firestore doc ID（自動生成）
  changeLogId: string;           // 参照元 change_logs の doc ID
  title: string;                 // 日本語タイトル（例: "Claude 1.9 リリース：ツール使用が大幅改善"）
  summary: string;               // 日本語要約本文（Markdown形式、500〜2000文字目安）
  keyPoints: string[];           // 重要ポイントの箇条書き（3〜7件）
  categories: DigestCategory[];  // 自動分類カテゴリ（複数可）
  sourceUrl: string;             // 元の公式変更ログURL
  originalVersion: string | null; // 元バージョン番号
  publishedAt: Timestamp;        // 元変更ログの公開日時
  createdAt: Timestamp;          // ダイジェスト生成日時
  updatedAt: Timestamp;          // 最終更新日時
  status: 'published' | 'draft' | 'archived';
}

type DigestCategory = 
  | 'new_feature'     // 新機能
  | 'improvement'     // 改善
  | 'bug_fix'         // バグ修正
  | 'deprecation'     // 非推奨
  | 'breaking_change' // 破壊的変更
  | 'other';          // その他
```

**バリデーション**:
- `title` は必須、255文字以内
- `summary` は必須
- `keyPoints` は1件以上必須
- `categories` は1件以上必須

**インデックス**:
- `status, publishedAt DESC` — 公開記事一覧（メイン一覧）
- `status, categories, publishedAt DESC` — カテゴリフィルタ
- `status, createdAt DESC` — 生成順

---

## State Transitions

### ChangeLog ステータス遷移

```
pending → processing → processed
                    ↘ error
```

- `pending`: 取得済みで未処理
- `processing`: AI 要約処理中
- `processed`: DigestArticle 生成完了
- `error`: 処理失敗（再試行可能）

### DigestArticle ステータス遷移

```
draft → published → archived
```

- `draft`: 生成完了・未公開（将来の審査フロー用）
- `published`: 公開済み（v1では processed 即 published）
- `archived`: アーカイブ済み（更新版が存在する場合など）

---

## Relationships

```
ChangeLog (1) ──── (0..1) DigestArticle
  └─ changeLogId FK
```

---

## Firestore セキュリティルール方針

```
// 読み取り: 全ユーザー（認証不要）
// 書き込み: Firebase Functions のみ（Admin SDK 経由）
match /digest_articles/{docId} {
  allow read: if resource.data.status == 'published';
  allow write: if false; // Admin SDK only
}
match /change_logs/{docId} {
  allow read: if false; // Admin SDK only
  allow write: if false; // Admin SDK only
}
```
