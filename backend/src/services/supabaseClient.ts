import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ 
    path: path.resolve(__dirname, '../../.env') 
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY 
  || process.env.SUPABASE_ANON_KEY;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', supabaseUrl ? 'Found' : 'MISSING');
console.log('SUPABASE_KEY:', supabaseKey ? 'Found' : 'MISSING');
console.log('SUPABASE_KEY prefix:', supabaseKey?.substring(0, 15));

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    fetch: fetch
  }
});
