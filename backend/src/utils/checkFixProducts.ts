import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { supabase } from '../services/supabaseClient';

const testDb = async () => {
  console.log("=== STEP 1: CURRENT STATE ===");
  const { data: currentData } = await supabase
    .from('products')
    .select('id, name, category, price, image_url, stock_quantity')
    .in('name', ['Cycling Helmet', 'Marble Serving Board', 'Yoga Mat Premium'])
    .order('category', { ascending: true })
    .order('name', { ascending: true });
    
  console.table(currentData);

  console.log("\n=== STEP 2 & 3: UPSERT PRODUCTS ===");
  const productsToUpsert = [
    {
      name: 'Cycling Helmet',
      description: 'Lightweight aerodynamic cycling helmet with ventilation',
      price: 79.99,
      category: 'Sports',
      image_url: 'https://images.unsplash.com/photo-1557803175-aecd09afe82a?w=400&h=300&fit=crop',
      stock_quantity: 25
    },
    {
      name: 'Marble Serving Board',
      description: 'Elegant marble and wood serving board for entertaining',
      price: 54.99,
      category: 'Home & Living',
      image_url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&h=300&fit=crop',
      stock_quantity: 20
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip premium yoga mat with alignment lines',
      price: 39.99,
      category: 'Sports',
      image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop',
      stock_quantity: 55
    }
  ];

  for (const product of productsToUpsert) {
    const { data: existing } = await supabase.from('products').select('id').eq('name', product.name).single();
    if (existing && existing.id) {
       await supabase.from('products').update(product).eq('id', existing.id);
       console.log(`Updated ${product.name}`);
    } else {
       await supabase.from('products').insert([product]);
       console.log(`Inserted ${product.name}`);
    }
  }

  console.log("\n=== STEP 6: VERIFY CATEGORY COUNTS ===");
  const { data: allProds } = await supabase.from('products').select('name, category').order('name', { ascending: true });
  
  if (allProds) {
    const aggregate = allProds.reduce((acc: any, p) => {
      if (!acc[p.category]) acc[p.category] = { total: 0, products: [] };
      acc[p.category].total += 1;
      acc[p.category].products.push(p.name);
      return acc;
    }, {});
    
    // Sort array in aggregate keys
    const sortedKeys = Object.keys(aggregate).sort();
    sortedKeys.forEach(k => {
      console.log(`${k}: ${aggregate[k].total} products => [${aggregate[k].products.join(', ')}]`);
    });
  }
};

testDb();
