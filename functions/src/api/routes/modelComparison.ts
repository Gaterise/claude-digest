import { Router, Request, Response, NextFunction } from "express";
import * as modelComparisonRepo from "../../firestore/modelComparisonRepository";
import { toModelComparisonResponse } from "../../modelComparison/response";

const router = Router();

/** GET /model-comparison — Claude モデル・ベンチマーク・話題の AI モデル */
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await modelComparisonRepo.getModelComparison();
    res.json(toModelComparisonResponse(data));
  } catch (error) {
    next(error);
  }
});

export default router;
