# claude_digest Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-14

## Active Technologies

- (001-claude-digest)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for 

## Code Style

: Follow standard conventions

## Recent Changes

- 001-claude-digest: Added

<!-- MANUAL ADDITIONS START -->
## Interaction Constitution

**すべてのチャットは `askQuestions` ツールを使って進めること。**

- ユーザーからリクエストを受けたら、まず `askQuestions` ツールで要件・意図・スコープを確認してから実装に着手する
- 曖昧な点や不明点が一つでもある場合は、推測で進めずに必ず質問する
- 質問なしに実装を開始してはならない（自明な単一ステップのタスクを除く）
<!-- MANUAL ADDITIONS END -->
