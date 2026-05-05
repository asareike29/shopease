import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { orderService } from '../services/orderService';
import paymentService from '../services/paymentService';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import './Checkout.css';

const GHANA_REGIONS = [
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
  'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
  'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
];

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: 'Greater Accra',
    postal_code: '',
    country: 'Ghana'
  });
  
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.full_name || 
        !shippingAddress.address_line1 || 
        !shippingAddress.city || 
        !shippingAddress.country || 
        !shippingAddress.region) {
      setError('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderResponse = await orderService.createOrder({
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        total_amount: total
      });

      const paystackResponse = await paymentService.initializePayment({
        email: currentUser?.email || 'customer@shopease.com',
        amount: total,
        orderId: orderResponse.id
      });

      if (paystackResponse.authorization_url) {
        clearCart();
        window.location.href = paystackResponse.authorization_url;
      } else {
        clearCart();
        navigate('/order-confirmation', {
          state: { orderId: orderResponse.id }
        });
      }

    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 
        'Payment failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Prevents render flash before redirect
  }

  if (items.length === 0) {
    return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>No items to checkout.</div>;
  }

  return (
    <div className="checkout-page container">
      
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="step completed">Cart</div>
        <div className="step-divider completed"></div>
        <div className="step active">Checkout</div>
        <div className="step-divider"></div>
        <div className="step inactive">Confirmation</div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="checkout-layout">
        
        {/* Left: Checkout Form */}
        <form className="checkout-form shadow" onSubmit={handlePlaceOrder}>
          
          <div className="form-section">
            <h2>1. Contact Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name</label>
                <input type="text" name="full_name" value={shippingAddress.full_name} onChange={handleInputChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="john@example.com" value={currentUser?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" required placeholder="+233 55 000 0000" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>2. Shipping Address</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address Line 1</label>
                <input type="text" name="address_line1" value={shippingAddress.address_line1} onChange={handleInputChange} required placeholder="123 Main St" />
              </div>
              <div className="form-group full-width">
                <label>Address Line 2 (Optional)</label>
                <input type="text" name="address_line2" value={shippingAddress.address_line2} onChange={handleInputChange} placeholder="Apt 4B" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} required placeholder="Accra" />
              </div>
              <div className="form-group">
                <label>Region/State</label>
                <select name="region" value={shippingAddress.region} onChange={handleInputChange} required>
                  {GHANA_REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" name="postal_code" value={shippingAddress.postal_code} onChange={handleInputChange} required placeholder="00233" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={shippingAddress.country} onChange={handleInputChange} required>
                  <option value="Ghana">Ghana</option>
                </select>
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="form-section border-top pt-4">
            <h2>3. Payment Method</h2>
            
            <div style={{ backgroundColor: '#EBF5FB', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #1F8A9C' }}>
              <h4 style={{ color: '#0D2B55', margin: '0 0 15px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span> Secured by Paystack — Ghana's trusted payment platform
              </h4>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ padding: '8px 12px', background: '#F4D03F', borderRadius: '6px', color: '#2C3E50', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #D4AC0D' }}>MTN Mobile Money</div>
                <div style={{ padding: '8px 12px', background: '#E74C3C', borderRadius: '6px', color: '#FFF', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #C0392B' }}>Vodafone Cash</div>
                <div style={{ padding: '8px 12px', background: '#3498DB', borderRadius: '6px', color: '#FFF', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #2980B9' }}>AirtelTigo Money</div>
                <div style={{ padding: '8px 12px', background: '#1A5276', borderRadius: '6px', color: '#FFF', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #0D2B55' }}>Visa</div>
                <div style={{ padding: '8px 12px', background: '#E67E22', borderRadius: '6px', color: '#FFF', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #D35400' }}>Mastercard</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '15px', borderRadius: '6px', border: '1px dashed #1A5276' }}>
                <p style={{ fontWeight: 'bold', color: '#1A5276', margin: '0 0 10px 0' }}>Test Payment Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#2C3E50' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Test Card:</strong> 4084 0840 8408 4081</p>
                    <p style={{ margin: 0 }}><strong>Expiry:</strong> 07/25 | <strong>CVV:</strong> 408</p>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}><strong>Mobile Money:</strong> 0551234987</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              background: '#F0A500', 
              color: '#0D2B55', 
              width: '100%', 
              padding: '16px', 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background 0.3s'
            }} 
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Place Order & Pay with Paystack'}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="checkout-summary shadow">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="s-qty">{item.quantity}x</div>
                <div className="s-name">{item.product.name}</div>
                <div className="s-price">GHS {(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>GHS {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>GHS {shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>GHS {tax.toFixed(2)}</span>
            </div>
            <div className="summary-total-row">
              <span>Total</span>
              <span>GHS {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
