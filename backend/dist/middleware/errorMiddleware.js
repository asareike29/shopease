"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
// Global error handler
const errorMiddleware = (err, req, res, next) => {
    console.error('[Error]:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        message,
        status
    });
};
exports.errorMiddleware = errorMiddleware;
