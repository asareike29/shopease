"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
// Public routes
router.get('/', productController_1.getAllProducts);
router.get('/:id', productController_1.getProductById);
// Admin routes
router.post('/', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validateMiddleware_1.validateMiddleware)(schemas_1.productSchema), productController_1.createProduct);
router.put('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validateMiddleware_1.validateMiddleware)(schemas_1.productSchema), productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, productController_1.deleteProduct);
exports.default = router;
