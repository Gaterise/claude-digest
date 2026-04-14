"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiError = createApiError;
exports.errorHandler = errorHandler;
const firebase_functions_1 = require("firebase-functions");
function createApiError(statusCode, errorCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errorCode = errorCode;
    return error;
}
function errorHandler(err, _req, res, _next) {
    const statusCode = "statusCode" in err ? err.statusCode : 500;
    const errorCode = "errorCode" in err ? err.errorCode : "INTERNAL_ERROR";
    firebase_functions_1.logger.error(`API Error [${errorCode}]: ${err.message}`, {
        stack: err.stack,
    });
    res.status(statusCode).json({
        error: errorCode,
        message: err.message,
    });
}
//# sourceMappingURL=errorHandler.js.map