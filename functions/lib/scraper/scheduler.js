"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledScrape = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firebase_functions_1 = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const githubReleaseScraper_1 = require("./githubReleaseScraper");
const claudeSummarizer_1 = require("../summarizer/claudeSummarizer");
const changeLogRepo = __importStar(require("../firestore/changeLogRepository"));
const digestRepo = __importStar(require("../firestore/digestRepository"));
/**
 * 6時間ごとに anthropics/claude-code GitHub Releases API をポーリングし、
 * 新しいリリースがあれば AI 要約を生成してダイジェスト記事を作成する。
 */
exports.scheduledScrape = (0, scheduler_1.onSchedule)({
    schedule: "every 6 hours",
    region: "asia-northeast1",
    timeoutSeconds: 300,
    memory: "512MiB",
    secrets: ["ANTHROPIC_API_KEY"],
}, async () => {
    firebase_functions_1.logger.info("GitHub Releases ポーリング開始");
    try {
        // 1. GitHub Releases を取得（最新30件）
        const entries = await (0, githubReleaseScraper_1.fetchGitHubReleases)(30, 1);
        firebase_functions_1.logger.info(`${entries.length} 件のリリースを取得`);
        let newCount = 0;
        for (const entry of entries) {
            // 2. 重複チェック & 保存
            const changeLog = await changeLogRepo.create({
                sourceUrl: entry.sourceUrl,
                rawContent: entry.rawContent,
                tagName: entry.tagName,
                version: entry.version,
                publishedAt: firestore_1.Timestamp.fromDate(entry.publishedAt),
                fetchedAt: firestore_1.Timestamp.now(),
                contentHash: entry.contentHash,
                status: "pending",
                errorMessage: null,
            });
            if (!changeLog) {
                // 重複 → スキップ
                continue;
            }
            newCount++;
            firebase_functions_1.logger.info(`新規 ChangeLog 保存: ${changeLog.id} (${entry.tagName})`);
            // 3. AI 要約生成
            try {
                await changeLogRepo.updateStatus(changeLog.id, "processing");
                const result = await (0, claudeSummarizer_1.summarizeChangeLog)(entry.rawContent, entry.title);
                // 4. ダイジェスト記事作成
                const article = await digestRepo.create({
                    changeLogId: changeLog.id,
                    title: result.title,
                    summary: result.summary,
                    keyPoints: result.keyPoints,
                    categories: result.categories,
                    sourceUrl: entry.sourceUrl,
                    originalVersion: entry.version,
                    publishedAt: firestore_1.Timestamp.fromDate(entry.publishedAt),
                    createdAt: firestore_1.Timestamp.now(),
                    updatedAt: firestore_1.Timestamp.now(),
                    status: "published",
                });
                await changeLogRepo.updateStatus(changeLog.id, "processed");
                firebase_functions_1.logger.info(`ダイジェスト記事作成完了: ${article.id}`);
            }
            catch (error) {
                const msg = error instanceof Error ? error.message : "不明なエラー";
                await changeLogRepo.updateStatus(changeLog.id, "error", msg);
                firebase_functions_1.logger.error(`要約生成エラー (${changeLog.id}): ${msg}`);
            }
        }
        firebase_functions_1.logger.info(`ポーリング完了: 新規 ${newCount} 件 / 全 ${entries.length} 件`);
    }
    catch (error) {
        firebase_functions_1.logger.error("GitHub Releases ポーリングエラー:", error);
        throw error;
    }
});
//# sourceMappingURL=scheduler.js.map