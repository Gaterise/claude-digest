import { Router, Request, Response, NextFunction } from "express";
import * as digestRepo from "../../firestore/digestRepository";
import { createApiError } from "../middleware/errorHandler";
import type { DigestCategory } from "../../types";

const router = Router();

/** GET /digests — ダイジェスト記事一覧 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 30, 1),
      50
    );
    const cursor = (req.query.cursor as string) || undefined;
    const category = (req.query.category as DigestCategory) || undefined;
    const from = (req.query.from as string) || undefined;
    const to = (req.query.to as string) || undefined;

    // バリデーション
    if (category) {
      const validCategories: DigestCategory[] = [
        "new_feature", "improvement", "bug_fix",
        "deprecation", "breaking_change", "other",
      ];
      if (!validCategories.includes(category)) {
        throw createApiError(400, "VALIDATION_ERROR", `無効なカテゴリ: ${category}`);
      }
    }
    if (from && isNaN(Date.parse(from))) {
      throw createApiError(400, "VALIDATION_ERROR", "from の日付形式が不正です");
    }
    if (to && isNaN(Date.parse(to))) {
      throw createApiError(400, "VALIDATION_ERROR", "to の日付形式が不正です");
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
  } catch (error) {
    next(error);
  }
});

/** GET /digests/:id — ダイジェスト記事詳細 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await digestRepo.findPublishedById(String(req.params.id));
    if (!article) {
      throw createApiError(404, "NOT_FOUND", "指定されたダイジェスト記事が見つかりません");
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
  } catch (error) {
    next(error);
  }
});

export default router;
