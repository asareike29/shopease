"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort, page = 1, limit = 50 } = req.query;
        let query = supabaseClient_1.supabase
            .from('products')
            .select('*', { count: 'exact' });
        if (category) {
            query = query.eq('category', category);
        }
        if (minPrice) {
            query = query.gte('price', Number(minPrice));
        }
        if (maxPrice) {
            query = query.lte('price', Number(maxPrice));
        }
        if (sort === 'price_asc') {
            query = query.order('price', { ascending: true });
        }
        else if (sort === 'price_desc') {
            query = query.order('price', { ascending: false });
        }
        else if (sort === 'newest') {
            query = query.order('created_at', { ascending: false });
        }
        else {
            query = query.order('created_at', { ascending: false });
        }
        const from = (Number(page) - 1) * Number(limit);
        const to = from + Number(limit) - 1;
        query = query.range(from, to);
        const { data, error, count } = await query;
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({
            success: true,
            data,
            total: count,
            page: Number(page),
            limit: Number(limit)
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: product, error } = await supabaseClient_1.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { data: product, error } = await supabaseClient_1.supabase
            .from('products')
            .insert(req.body)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: product, error } = await supabaseClient_1.supabase
            .from('products')
            .update({ ...req.body, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseClient_1.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteProduct = deleteProduct;
