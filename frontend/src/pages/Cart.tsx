import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { cartService } from '../services/cartService';
import LoadingSpinner from '../components/LoadingSpinner';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [syncingItem, setSyncingItem] = useState<string | null>(null);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSyncingItem(productId);
    try {
      if (isLoggedIn) {
        await cartService.updateCartItem(productId, newQuantity);
      }
      updateQuantity(productId, newQuantity);
    } catch (err) {
      console.error('Failed to sync cart update', err);
    } finally {
      setSyncingItem(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setSyncingItem(productId);
    try {
      if (isLoggedIn) {
        await cartService.removeCartItem(productId);
      }
      removeFromCart(productId);
    } catch (err) {
      console.error('Failed to sync cart removal', err);
    } finally {
      setSyncingItem(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-page container">
        <ShoppingCart size={64} className="empty-icon" />
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn-primary start-shopping-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  const shipping = 9.99;
  const tax = subtotal * 0.08; // Mock 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items-section shadow">
          {items.map(item => (
            <div key={item.id} className={`cart-item ${syncingItem === item.product_id ? 'syncing' : ''}`}>
              <div className="cart-item-image">
                <img src={item.product.image_url} alt={item.product.name} />
              </div>
              
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <span className="cart-item-category">{item.product.category}</span>
                <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
              </div>
              
              <div className="cart-item-actions">
                <div className="quantity-selector">
                  <button disabled={syncingItem === item.product_id} onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button disabled={syncingItem === item.product_id} onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemove(item.product_id)}
                  aria-label="Remove item"
                  disabled={syncingItem === item.product_id}
                >
                  {syncingItem === item.product_id ? <LoadingSpinner size="small" /> : <Trash2 size={20} />}
                </button>
              </div>

              <div className="cart-item-subtotal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section shadow">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          
          <div className="continue-shopping">
            <Link to="/products">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
