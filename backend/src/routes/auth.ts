import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateMiddleware } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema } from '../types/schemas';

const router = Router();

router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
