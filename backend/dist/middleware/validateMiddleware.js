"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const zod_1 = require("zod");
const validateMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                });
            }
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }
    };
};
exports.validateMiddleware = validateMiddleware;
