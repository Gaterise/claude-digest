# Quickstart: AI モデル比較

## テスト

```bash
npm test -- tests/unit/modelComparison tests/unit/lib/modelComparison.test.ts \
  tests/unit/components/ModelComparisonTabs.test.tsx tests/unit/components/ClaudeModelsPanel.test.tsx \
  tests/unit/components/BenchmarkPanel.test.tsx tests/unit/components/TrendingModelsPanel.test.tsx \
  tests/integration/api/modelComparison.test.ts
npm run typecheck && npm run build
npm --prefix functions run build
```

## ローカル確認

1. `npm run dev:full`（エミュレーター + Next.js）
2. `http://localhost:3000/models` を開く → 初期データ（現行内容）で Claude タブが表示される
3. `?tab=benchmarks` / `?tab=trending` で各タブ（未生成時は「準備中」）
4. 日次更新の手動実行: `npm --prefix functions run shell` → `scheduledModelComparison()`
   （Vertex AI を呼ぶため本番プロジェクトの ADC 認証が必要）

## デプロイ後の確認

- Cloud Scheduler に `firebase-schedule-scheduledModelComparison-asia-northeast1` が `0 6 * * *`（Asia/Tokyo）で登録されていること
- Cloud Scheduler から「強制実行」→ Functions ログで「AIモデル比較更新完了」を確認
- `/models` の最終更新日が当日になっていること
