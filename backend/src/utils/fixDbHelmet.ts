import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { supabase } from '../services/supabaseClient';

const fixDb = async () => {
    console.log("Fixing 404 helmet image...");
    await supabase.from('products').update({ image_url: 'https://images.unsplash.com/photo-1582996269871-dad1e4adbbc7?w=400&h=300&fit=crop' }).eq('name', 'Cycling Helmet');
    console.log("Fixed!");
}

fixDb();
