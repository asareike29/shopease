"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const supabaseClient_1 = require("../services/supabaseClient");
const fixDb = async () => {
    console.log("Fixing 404 helmet image...");
    await supabaseClient_1.supabase.from('products').update({ image_url: 'https://images.unsplash.com/photo-1582996269871-dad1e4adbbc7?w=400&h=300&fit=crop' }).eq('name', 'Cycling Helmet');
    console.log("Fixed!");
};
fixDb();
