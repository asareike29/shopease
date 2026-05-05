"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabaseClient_1 = require("../services/supabaseClient");
const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const { data: existingUser } = await supabaseClient_1.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const password_hash = await bcryptjs_1.default.hash(password, 12);
        const { data: newUser, error } = await supabaseClient_1.supabase
            .from('users')
            .insert({ email, full_name, password_hash, role: 'customer' })
            .select('id, email, full_name, role, created_at')
            .single();
        if (error || !newUser) {
            return res.status(500).json({ success: false, message: error?.message || 'Error creating user' });
        }
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, data: { user: newUser, token } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password_hash, ...userWithoutPassword } = user;
        res.json({ success: true, data: { user: userWithoutPassword, token } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { data: user, error } = await supabaseClient_1.supabase
            .from('users')
            .select('id, email, full_name, role, created_at')
            .eq('id', req.user.id)
            .single();
        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: { user } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getMe = getMe;
