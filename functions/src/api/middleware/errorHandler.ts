import { Request, Response, NextFunction } from "express";
import { logger } from "firebase-functions";

export interface ApiError extends Error {
  statusCode: number;
  errorCode: string;
}

export function createApiError(
  statusCode: number,
  errorCode: string,
  message: string
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.errorCode = errorCode;
  return error;
}

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const errorCode = "errorCode" in err ? err.errorCode : "INTERNAL_ERROR";

  logger.error(`API Error [${errorCode}]: ${err.message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: errorCode,
    message: err.message,
  });
}
