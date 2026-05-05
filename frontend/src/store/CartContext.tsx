import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shopease_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopease_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        try {
          const response = await cartService.getCart();
          if (response.data && response.data.length > 0) {
            setItems(response.data.map((item: any) => ({
              id: item.product_id,
              product_id: item.product_id,
              product: item.products,
              quantity: item.quantity,
              price: item.products.price
            })));
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    };
    loadCart();
  }, [currentUser]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          product_id: product.id,
          product,
          quantity,
          price: product.price
        },
      ];
    });

    if (currentUser) {
      try {
        await cartService.addToCart({ 
          product_id: product.id, 
          quantity 
        });
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
