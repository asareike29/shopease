"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getMyOrders = exports.getAllOrders = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const getAllOrders = async (req, res) => {
    try {
        const { data: orders, error } = await supabaseClient_1.supabase
            .from('orders')
            .select('*, users(full_name, email), order_items(*, products(*))')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllOrders = getAllOrders;
const getMyOrders = async (req, res) => {
    try {
        const { data: orders, error } = await supabaseClient_1.supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', req.user?.id)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: order, error } = await supabaseClient_1.supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('id', id)
            .single();
        if (error || !order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, data: order });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const { items, shipping_address } = req.body;
        // Calculate total from items array elements
        // We assume backend calculates it based on provided items, or we can fetch products manually. For here, using item.price from payload (if exists), or better fetch price from db.
        // The prompt says:
        // const orderItems = items.map(item => ({ ... unit_price: item.price, subtotal: item.quantity * item.price }))
        // Wait, let's fetch product prices to securely calculate total
        let total_amount = 0;
        const productIds = items.map((i) => i.product_id);
        const { data: products } = await supabaseClient_1.supabase.from('products').select('id, price').in('id', productIds);
        if (!products) {
            return res.status(400).json({ success: false, message: 'Products not found' });
        }
        const enrichedItems = items.map((item) => {
            const p = products.find(prod => prod.id === item.product_id);
            const price = p ? Number(p.price) : 0;
            total_amount += item.quantity * price;
            return { ...item, price };
        });
        const tax = total_amount * 0.08;
        const shipping = 9.99;
        const final_amount = total_amount + tax + shipping;
        const { data: order, error } = await supabaseClient_1.supabase
            .from('orders')
            .insert({
            user_id: req.user?.id,
            status: 'pending',
            total_amount: final_amount,
            shipping_address
        })
            .select()
            .single();
        if (error || !order) {
            return res.status(500).json({ success: false, message: error?.message || 'Error inserting order' });
        }
        const orderItems = enrichedItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.quantity * item.price
        }));
        await supabaseClient_1.supabase.from('order_items').insert(orderItems);
        await supabaseClient_1.supabase
            .from('cart_items')
            .delete()
            .eq('user_id', req.user?.id);
        res.json({ success: true, data: order });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { data: order, error } = await supabaseClient_1.supabase
            .from('orders')
            .update({ status, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: order });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
