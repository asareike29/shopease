"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = exports.productSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    full_name: zod_1.z.string().min(2)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    category: zod_1.z.string(),
    image_url: zod_1.z.string().url(),
    stock_quantity: zod_1.z.number().int().min(0)
});
exports.orderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        product_id: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive()
    })),
    shipping_address: zod_1.z.object({
        full_name: zod_1.z.string(),
        address_line1: zod_1.z.string(),
        address_line2: zod_1.z.string().optional(),
        city: zod_1.z.string(),
        region: zod_1.z.string(),
        postal_code: zod_1.z.string(),
        country: zod_1.z.string()
    })
});
