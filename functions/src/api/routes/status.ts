import { Router, Request, Response, NextFunction } from "express";
import * as metaRepo from "../../firestore/metaRepository";

const router = Router();

/** GET /status — 公式リリースの最終チェック日時 */
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const lastCheckedAt = await metaRepo.getLastCheckedAt();

    res.json({
      lastCheckedAt: lastCheckedAt ? lastCheckedAt.toDate().toISOString() : null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;