import { Request, Response } from 'express';
import axios from 'axios';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { supabase } from '../services/supabaseClient';

dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const initializePayment = async (req: Request, res: Response): Promise<Response> => {
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

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url, reference, access_code } = response.data.data;

    return res.status(200).json({
      success: true,
      authorization_url,
      reference,
      access_code,
    });
  } catch (error: unknown) {
    console.error('Paystack initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
    });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required',
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, metadata, amount } = response.data.data;

    if (status === 'success') {
      const orderId = metadata?.orderId;
      
      if (orderId) {
        const { error } = await supabase
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
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error: unknown) {
    console.error('Paystack verification error:', error);
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    
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
        const { error } = await supabase
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
  } catch (error: unknown) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      message: 'Webhook processing failed',
    });
  }
};
