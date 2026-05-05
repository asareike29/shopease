import { Router } from 'express';
import { initializePayment, verifyPayment, handleWebhook } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/initialize', authMiddleware, initializePayment);
router.get('/verify/:reference', authMiddleware, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
