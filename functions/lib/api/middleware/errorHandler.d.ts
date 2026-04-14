import { Request, Response, NextFunction } from "express";
export interface ApiError extends Error {
    statusCode: number;
    errorCode: string;
}
export declare function createApiError(statusCode: number, errorCode: string, message: string): ApiError;
export declare function errorHandler(err: Error | ApiError, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map