import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/errorMiddleware';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import userRoutes from './routes/users';
import { supabase } from './services/supabaseClient';

const app = express();

// Health check - must be before other routes
app.get('/health', async (_req, res) => {
  try {
    const { data, error } = await supabase
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
  } catch (err: any) {
    res.json({
      status: 'error',
      supabase_connection: 'FAILED',
      error: err.message,
      stack: err.stack
    });
  }
});

app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});