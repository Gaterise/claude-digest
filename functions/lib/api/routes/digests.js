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
const express_1 = require("express");
const digestRepo = __importStar(require("../../firestore/digestRepository"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
/** GET /digests — ダイジェスト記事一覧 */
router.get("/", async (req, res, next) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 30, 1), 50);
        const cursor = req.query.cursor || undefined;
        const category = req.query.category || undefined;
        const from = req.query.from || undefined;
        const to = req.query.to || undefined;
        // バリデーション
        if (category) {
            const validCategories = [
                "new_feature", "improvement", "bug_fix",
                "deprecation", "breaking_change", "other",
            ];
            if (!validCategories.includes(category)) {
                throw (0, errorHandler_1.createApiError)(400, "VALIDATION_ERROR", `無効なカテゴリ: ${category}`);
            }
        }
        if (from && isNaN(Date.parse(from))) {
            throw (0, errorHandler_1.createApiError)(400, "VALIDATION_ERROR", "from の日付形式が不正です");
        }
        if (to && isNaN(Date.parse(to))) {
            throw (0, errorHandler_1.createApiError)(400, "VALIDATION_ERROR", "to の日付形式が不正です");
        }
        const result = await digestRepo.listPublished({
            limit,
            cursor,
            category,
            from,
            to,
        });
        // Firestore Timestamp を ISO 文字列に変換
        const items = result.items.map((item) => ({
            id: item.id,
            title: item.title,
            keyPoints: item.keyPoints,
            categories: item.categories,
            sourceUrl: item.sourceUrl,
            originalVersion: item.originalVersion,
            publishedAt: item.publishedAt.toDate().toISOString(),
            createdAt: item.createdAt.toDate().toISOString(),
        }));
        res.json({
            items,
            total: result.total,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        next(error);
    }
});
/** GET /digests/:id — ダイジェスト記事詳細 */
router.get("/:id", async (req, res, next) => {
    try {
        const article = await digestRepo.findPublishedById(String(req.params.id));
        if (!article) {
            throw (0, errorHandler_1.createApiError)(404, "NOT_FOUND", "指定されたダイジェスト記事が見つかりません");
        }
        res.json({
            id: article.id,
            title: article.title,
            summary: article.summary,
            keyPoints: article.keyPoints,
            categories: article.categories,
            sourceUrl: article.sourceUrl,
            originalVersion: article.originalVersion,
            publishedAt: article.publishedAt.toDate().toISOString(),
            createdAt: article.createdAt.toDate().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=digests.js.map