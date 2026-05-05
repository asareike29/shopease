"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protected routes
router.use(authMiddleware_1.authMiddleware);
router.get('/', cartController_1.getCart);
router.post('/', cartController_1.addToCart);
router.put('/:id', cartController_1.updateCartItem);
router.delete('/:id', cartController_1.removeCartItem);
router.delete('/', cartController_1.clearCart);
exports.default = router;
