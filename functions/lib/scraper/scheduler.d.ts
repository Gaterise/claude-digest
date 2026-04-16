/**
 * 1時間ごとに anthropics/claude-code GitHub Releases API をポーリングし、
 * 新しいリリースがあれば AI 要約を生成してダイジェスト記事を作成する。
 * また、前回エラーになった ChangeLog を再処理する。
 */
export declare const scheduledScrape: import("firebase-functions/v2/scheduler").ScheduleFunction;
//# sourceMappingURL=scheduler.d.ts.map