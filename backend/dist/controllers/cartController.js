"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const getCart = async (req, res) => {
    try {
        const { data: cartItems, error } = await supabaseClient_1.supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', req.user?.id);
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: cartItems });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const { data: existing } = await supabaseClient_1.supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', req.user?.id)
            .eq('product_id', product_id)
            .single();
        if (existing) {
            await supabaseClient_1.supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id);
        }
        else {
            await supabaseClient_1.supabase
                .from('cart_items')
                .insert({ user_id: req.user?.id, product_id, quantity });
        }
        res.json({ success: true, message: 'Added to cart' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const itemId = req.params.id;
        const { data, error } = await supabaseClient_1.supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId)
            .eq('user_id', req.user?.id)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { error } = await supabaseClient_1.supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .eq('user_id', req.user?.id);
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: 'Item removed from cart' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res) => {
    try {
        const { error } = await supabaseClient_1.supabase
            .from('cart_items')
            .delete()
            .eq('user_id', req.user?.id);
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: 'Cart cleared' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.clearCart = clearCart;
