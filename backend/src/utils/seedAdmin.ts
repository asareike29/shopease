import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { supabase } from '../services/supabaseClient';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const password_hash = await bcrypt.hash('admin123', 12);
  
  const { data, error } = await supabase
    .from('users')
    .upsert({
      email: 'admin@shopease.com',
      full_name: 'ShopEase Admin',
      password_hash,
      role: 'admin'
    }, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Error seeding admin:', error);
  } else {
    console.log('Admin user created:', data.email);
  }
  process.exit(0);
}

seedAdmin();
