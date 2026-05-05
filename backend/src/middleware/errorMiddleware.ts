import { Request, Response, NextFunction } from 'express';

// Global error handler
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    status
  });
};
