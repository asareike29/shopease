"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
// Protected routes
router.use(authMiddleware_1.authMiddleware);
router.get('/myorders', orderController_1.getMyOrders);
router.post('/', (0, validateMiddleware_1.validateMiddleware)(schemas_1.orderSchema), orderController_1.createOrder);
router.get('/:id', orderController_1.getOrderById);
// Admin routes
router.get('/', adminMiddleware_1.adminMiddleware, orderController_1.getAllOrders);
router.put('/:id/status', adminMiddleware_1.adminMiddleware, orderController_1.updateOrderStatus);
exports.default = router;
