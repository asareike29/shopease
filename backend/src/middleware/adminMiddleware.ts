import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden - Admin only' });
  }
  
  next();
};
