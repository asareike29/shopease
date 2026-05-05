import { Router } from 'express';
import { getAllOrders, getMyOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { validateMiddleware } from '../middleware/validateMiddleware';
import { orderSchema } from '../types/schemas';

const router = Router();

// Protected routes
router.use(authMiddleware);

router.get('/myorders', getMyOrders);
router.post('/', validateMiddleware(orderSchema), createOrder);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', adminMiddleware, getAllOrders);
router.put('/:id/status', adminMiddleware, updateOrderStatus);

export default router;
