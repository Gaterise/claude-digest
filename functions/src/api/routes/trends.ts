import { Router, Request, Response, NextFunction } from "express";
import * as trendRepo from "../../firestore/trendRepository";

const router = Router();

/** GET /trends — X / Threads で話題の AI トレンド一覧 */
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const trends = await trendRepo.getTrends();

    res.json({
      items: trends?.items ?? [],
      generatedAt: trends ? trends.generatedAt.toDate().toISOString() : null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
