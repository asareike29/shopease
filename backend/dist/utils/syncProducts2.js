"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const supabaseClient_1 = require("../services/supabaseClient");
const syncDb = async () => {
    console.log("Deleting test products...");
    await supabaseClient_1.supabase.from('products').delete().ilike('name', '%test%');
    await supabaseClient_1.supabase.from('products').delete().ilike('name', '%mock%');
    await supabaseClient_1.supabase.from('products').delete().ilike('name', '%sample%');
    const newElectronics = [
        {
            name: 'Smart Home Speaker',
            description: 'Voice controlled smart speaker with AI assistant',
            price: 99.99,
            category: 'Electronics',
            image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop',
            stock_quantity: 30
        },
        {
            name: 'USB-C Hub 7-in-1',
            description: '7 port USB-C hub with HDMI and card reader',
            price: 49.99,
            category: 'Electronics',
            image_url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop',
            stock_quantity: 45
        },
        {
            name: 'Mechanical Keyboard',
            description: 'Compact RGB mechanical gaming keyboard',
            price: 89.99,
            category: 'Electronics',
            image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
            stock_quantity: 25
        },
        {
            name: 'Laptop Stand Aluminium',
            description: 'Adjustable aluminium laptop stand for desk',
            price: 39.99,
            category: 'Electronics',
            image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
            stock_quantity: 40
        }
    ];
    console.log("Inserting 4 electronics...");
    const { error } = await supabaseClient_1.supabase.from('products').insert(newElectronics);
    if (error)
        console.error(error);
    console.log("Checking counts...");
    const { data: dbProds } = await supabaseClient_1.supabase.from('products').select('*');
    if (dbProds) {
        const counts = dbProds.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {});
        console.log("Category counts:", counts);
    }
};
syncDb();
