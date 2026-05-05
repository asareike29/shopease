import path from 'path';
import dotenv from 'dotenv';

// Ensure .env is loaded before relative module requires
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { supabase } from '../services/supabaseClient';

const runUpdates = async () => {
  console.log("Updating images...");
  await supabase.from('products').update({ image_url: 'https://images.unsplash.com/photo-1601925228008-54d428e4c55b?w=400&h=300&fit=crop' }).eq('name', 'Yoga Mat Premium');
  await supabase.from('products').update({ image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop' }).eq('name', 'Linen Throw Pillow Set');
  await supabase.from('products').update({ image_url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400&h=300&fit=crop' }).eq('name', 'Wireless Charging Pad');
  
  console.log("Inserting new products...");
  const newProducts = [
    { name: 'Classic Denim Jacket', description: 'Timeless denim jacket for all seasons', price: 69.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=300&fit=crop', stock_quantity: 40 },
    { name: 'Floral Summer Dress', description: 'Light and breezy floral dress for summer', price: 49.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop', stock_quantity: 35 },
    { name: 'Slim Fit Chino Pants', description: 'Comfortable slim fit chinos for everyday wear', price: 44.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop', stock_quantity: 50 },
    { name: 'Wool Blend Scarf', description: 'Soft wool blend scarf for cold weather', price: 24.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=300&fit=crop', stock_quantity: 60 },
    { name: 'Canvas Sneakers', description: 'Classic canvas sneakers in white', price: 54.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=400&h=300&fit=crop', stock_quantity: 45 },
    { name: 'Aviator Sunglasses', description: 'UV400 protection aviator sunglasses', price: 34.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop', stock_quantity: 55 },
    { name: 'Scented Soy Candle Set', description: 'Set of 3 hand-poured soy wax candles', price: 39.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=300&fit=crop', stock_quantity: 40 },
    { name: 'Bamboo Cutting Board', description: 'Eco-friendly bamboo cutting board set', price: 29.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', stock_quantity: 35 },
    { name: 'Wall Art Print Set', description: 'Set of 3 minimalist wall art prints', price: 44.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop', stock_quantity: 25 },
    { name: 'Cotton Knit Throw Blanket', description: 'Cozy cotton knit blanket for the sofa', price: 59.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400&h=300&fit=crop', stock_quantity: 30 },
    { name: 'Marble Serving Board', description: 'Elegant marble and wood serving board', price: 54.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1544829832-87a6a7a3a2bd?w=400&h=300&fit=crop', stock_quantity: 20 },
    { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells 5-25kg', price: 149.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop', stock_quantity: 20 },
    { name: 'Cycling Helmet', description: 'Lightweight aerodynamic cycling helmet', price: 79.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', stock_quantity: 25 },
    { name: 'Swimming Goggles Pro', description: 'Anti-fog UV protection swimming goggles', price: 19.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop', stock_quantity: 60 },
    { name: 'Jump Rope Speed Cable', description: 'Professional speed jump rope with bearings', price: 14.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', stock_quantity: 80 },
    { name: 'Foam Roller Massage', description: 'High density foam roller for muscle recovery', price: 29.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', stock_quantity: 45 }
  ];
  
  const { error } = await supabase.from('products').insert(newProducts);
  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Success inserting products!");
  }
};

runUpdates();
