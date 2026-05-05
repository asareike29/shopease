import { Response } from 'express';
import { AuthRequest } from '../types';
import { supabase } from '../services/supabaseClient';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', req.user?.id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, data: cartItems });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { product_id, quantity } = req.body;
    
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user?.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: req.user?.id, product_id, quantity });
    }

    res.json({ success: true, message: 'Added to cart' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('user_id', req.user?.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', req.user?.id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user?.id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
