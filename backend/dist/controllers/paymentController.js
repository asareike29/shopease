"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const supabaseClient_1 = require("../services/supabaseClient");
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const initializePayment = async (req, res) => {
    try {
        const { email, amount, orderId } = req.body;
        if (!email || !amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'email, amount, and orderId are required',
            });
        }
        const payload = {
            email,
            amount: Math.round(amount * 100), // amount in pesewas
            currency: "GHS",
            reference: `SHOPEASE-${orderId}-${Date.now()}`,
            callback_url: `${FRONTEND_URL}/order-confirmation`,
            metadata: { orderId }
        };
        const response = await axios_1.default.post('https://api.paystack.co/transaction/initialize', payload, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const { authorization_url, reference, access_code } = response.data.data;
        return res.status(200).json({
            success: true,
            authorization_url,
            reference,
            access_code,
        });
    }
    catch (error) {
        console.error('Paystack initialization error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to initialize payment',
        });
    }
};
exports.initializePayment = initializePayment;
const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;
        if (!reference) {
            return res.status(400).json({
                success: false,
                message: 'Payment reference is required',
            });
        }
        const response = await axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });
        const { status, metadata, amount } = response.data.data;
        if (status === 'success') {
            const orderId = metadata?.orderId;
            if (orderId) {
                const { error } = await supabaseClient_1.supabase
                    .from('orders')
                    .update({
                    status: 'processing',
                    stripe_payment_id: reference
                })
                    .eq('id', orderId);
                if (error) {
                    console.error('Error updating order:', error);
                }
            }
            return res.status(200).json({
                success: true,
                orderId,
                reference,
                amount: amount / 100, // convert back to GHS
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    }
    catch (error) {
        console.error('Paystack verification error:', error);
        return res.status(400).json({
            success: false,
            message: 'Payment verification failed',
        });
    }
};
exports.verifyPayment = verifyPayment;
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-paystack-signature'];
        if (!signature) {
            return res.status(400).json({ message: 'No signature found' });
        }
        const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== signature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }
        const event = req.body;
        if (event.event === 'charge.success') {
            const { metadata, reference } = event.data;
            const orderId = metadata?.orderId;
            if (orderId) {
                const { error } = await supabaseClient_1.supabase
                    .from('orders')
                    .update({
                    status: 'processing',
                    stripe_payment_id: reference
                })
                    .eq('id', orderId);
                if (error) {
                    console.error('Webhook: Error updating order:', error);
                }
            }
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({
            message: 'Webhook processing failed',
        });
    }
};
exports.handleWebhook = handleWebhook;
