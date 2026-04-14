<!--
SYNC IMPACT REPORT
==================
Version change: [UNVERSIONED] → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (I〜V)
  - 開発ワークフロー制約 (Development Workflow Constraints)
  - コミュニケーション規約 (Communication Standards)
  - Governance
Templates reviewed:
  - .specify/templates/plan-template.md       ✅ aligned (Constitution Check gate present)
  - .specify/templates/spec-template.md       ✅ aligned (TDD/acceptance scenarios present)
  - .specify/templates/tasks-template.md      ✅ aligned (test-first task ordering enforced)
  - .specify/templates/agent-file-template.md ✅ no outdated agent-specific references
  - .specify/templates/constitution-template.md ✅ source template, no changes needed
Follow-up TODOs: none
-->

# claude_digest Constitution

## Core Principles

### I. テスト駆動開発（NON-NEGOTIABLE）

TDD を全ての実装において厳格に適用する。

- テストコードを先に記述し、ユーザーの承認を得た後に実装を開始しなければならない（MUST）。
- テストは必ず「失敗（Red）」の状態で確認してから実装コードを書く（MUST）。
- Red → Green → Refactor のサイクルを厳守する（MUST）。
- 実装コードはテストを通過させる最小限のコードのみとする（SHOULD）。
- テストなしの実装コードのコミットは認めない（MUST）。

**Rationale**: テストを先に書くことで要件の曖昧さを排除し、設計品質と保守性を高める。
後付けテストでは網羅性が担保できないため、TDD を非交渉原則とする。

### II. 次の操作はユーザー確認必須

エージェントは各フェーズ完了後、次に行う操作を必ず `askQuestion` を通じてユーザーに確認しなければならない。

- 仕様確定、計画作成、タスク生成、実装の各フェーズの境界でユーザーに確認する（MUST）。
- 自律的に次のフェーズへ進んではならない（MUST）。
- 確認なしに複数フェーズを連続実行することを禁止する（MUST）。
- ユーザーが明示的に「続けて」と指示した場合のみ次フェーズに進むことができる（SHOULD）。

**Rationale**: ユーザーが常に開発の進捗と方向性を把握・制御できる状態を維持する。
自律的な先行実装はプロジェクトの逸脱リスクを高める。

### III. 日本語コミュニケーション

チャットでのやり取りは全て日本語で行わなければならない。

- エージェントからの返答・質問・説明は全て日本語で記述する（MUST）。
- コードコメント・ドキュメントの言語はプロジェクト規約に従う（SHOULD）。
- エラーメッセージ・ログの説明を日本語で補足する（SHOULD）。

**Rationale**: チームの共通言語を統一することで、認識齟齬を防ぎコミュニケーションコストを削減する。

### IV. 統合テストの徹底

新機能・契約変更・サービス間通信には統合テストを必須とする。

- 新しいモジュール・サービスのコントラクトテストを作成する（MUST）。
- 既存インターフェースの変更時には回帰テストを更新する（MUST）。
- 共有スキーマ変更時には影響範囲全体のテストを実施する（MUST）。

**Rationale**: 単体テストのみでは検出できないシステム結合部の欠陥を早期に発見する。

### V. シンプルさの優先

YAGNI（You Aren't Gonna Need It）原則を徹底し、必要最小限の実装を維持する。

- 現在の要件を満たす最もシンプルな実装を選択する（MUST）。
- 将来の拡張を見越した過剰な設計は行わない（MUST）。
- 複雑性を導入する場合は明確な正当化が必要である（MUST）。

**Rationale**: 過剰設計はメンテナンスコストを増大させ、バグの温床となる。

## 開発ワークフロー制約

各フェーズは以下の順序で実施し、順序を飛ばしてはならない。

1. **仕様作成** (`/speckit.specify`): 要件・ユーザーストーリーを確定する
2. **計画作成** (`/speckit.plan`): 技術方針・構造を確定する
3. **タスク生成** (`/speckit.tasks`): テスト込みのタスクリストを生成する
4. **テスト記述**: 実装前にテストコードを作成し、失敗を確認する
5. **ユーザー承認**: テストコードをユーザーに確認・承認してもらう
6. **実装**: 承認済みテストを通過させる実装コードを書く
7. **リファクタリング**: テストが通過した状態でコードを整理する

フェーズ間の移行は必ず `askQuestion` でユーザーに確認すること（MUST）。

## コミュニケーション規約

- 全ての返答・説明・質問は日本語で行う（MUST）。
- 次の操作を実施する前に `askQuestion` でユーザーの意図を確認する（MUST）。
- 曖昧な仕様は実装前に質問で明確化する（MUST）。
- エラーや問題が発生した場合は原因と対処法を日本語で説明する（MUST）。
- 技術用語は文脈に応じて日本語訳を付記する（SHOULD）。

## Governance

- この憲法はプロジェクトの全ての開発慣行より優先される（MUST）。
- 憲法の改定には文書化・承認・移行計画が必要である（MUST）。
- 全ての PR・レビューは憲法の原則への準拠を検証しなければならない（MUST）。
- 複雑性の導入は正当化を文書として残すこと（MUST）。
- 改定手続き: 改定案を提示 → ユーザー承認 → バージョン番号更新 → 関連テンプレートへの反映。
- バージョニングポリシー:
  - MAJOR: 原則の削除・再定義など後方互換性のない変更
  - MINOR: 新しい原則・セクションの追加や実質的な拡張
  - PATCH: 表現の明確化・誤字修正・意味論的でない改訂

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
