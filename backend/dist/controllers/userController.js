"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const supabaseClient_1 = require("../services/supabaseClient");
const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabaseClient_1.supabase
            .from('users')
            .select('id, email, full_name, role, created_at')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: user, error } = await supabaseClient_1.supabase
            .from('users')
            .select('id, email, full_name, role, created_at')
            .eq('id', id)
            .single();
        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: user, error } = await supabaseClient_1.supabase
            .from('users')
            .update({ ...req.body, updated_at: new Date() })
            .eq('id', id)
            .select('id, email, full_name, role, created_at')
            .single();
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, data: user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseClient_1.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteUser = deleteUser;
