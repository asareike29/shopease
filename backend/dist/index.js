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
const node_fetch_1 = __importStar(require("node-fetch"));
if (!globalThis.fetch) {
    globalThis.fetch = node_fetch_1.default;
    globalThis.Headers = node_fetch_1.Headers;
    globalThis.Request = node_fetch_1.Request;
    globalThis.Response = node_fetch_1.Response;
}
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
const users_1 = __importDefault(require("./routes/users"));
const supabaseClient_1 = require("./services/supabaseClient");
const app = (0, express_1.default)();
// Health check - must be before other routes
app.get('/health', async (_req, res) => {
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('products')
            .select('count')
            .limit(1);
        res.json({
            status: 'ok',
            env: process.env.NODE_ENV,
            supabase_url: process.env.SUPABASE_URL ? 'set' : 'missing',
            supabase_key: process.env.SUPABASE_SERVICE_KEY ? 'set' : 'missing',
            supabase_connection: error ? 'FAILED: ' + error.message : 'SUCCESS',
            data: data
        });
    }
    catch (err) {
        res.json({
            status: 'error',
            supabase_connection: 'FAILED',
            error: err.message,
            stack: err.stack
        });
    }
});
// Then middleware and routes after
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/users', users_1.default);
app.use(errorMiddleware_1.errorMiddleware);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
