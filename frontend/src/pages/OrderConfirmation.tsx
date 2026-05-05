import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import paymentService from '../services/paymentService';
import { useCart } from '../store/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>('idle');
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    reference: string;
    amount: number;
  } | null>(null);

  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const params = new URLSearchParams(location.search);
    const reference = params.get('reference') || params.get('trxref');

    if (reference) {
      verifyPayment(reference);
    } else {
      const stateOrderId = location.state?.orderId;
      if (stateOrderId) {
        setStatus('success');
        setOrderDetails({
          orderId: stateOrderId,
          reference: 'N/A',
          amount: 0
        });
        clearCart();
      } else {
        setStatus('error');
      }
    }
  }, [location, clearCart]);

  const verifyPayment = async (reference: string) => {
    setStatus('verifying');
    try {
      const response = await paymentService.verifyPayment(reference);
      if (response.success) {
        setOrderDetails({
          orderId: response.orderId,
          reference: response.reference,
          amount: response.amount
        });
        setStatus('success');
        clearCart();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'verifying' || status === 'idle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10rem 1rem', minHeight: '60vh' }}>
        <LoadingSpinner size="large" />
        <p style={{ marginTop: '1.5rem', color: '#2C3E50', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Verifying your payment...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <XCircle size={80} color="#E74C3C" style={{ margin: '0 auto 2rem' }} />
        <h1 style={{ marginBottom: '1rem', color: '#0D2B55' }}>Payment Verification Failed</h1>
        <p style={{ fontSize: '1.2rem', color: '#2C3E50', marginBottom: '2rem' }}>
          Please contact support if amount was deducted.
        </p>
        <button 
          onClick={() => navigate('/checkout')}
          style={{ 
            backgroundColor: '#F0A500', 
            color: '#0D2B55', 
            padding: '12px 24px', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
      <CheckCircle size={80} color="#27AE60" style={{ margin: '0 auto 1.5rem' }} />
      <h1 style={{ marginBottom: '0.5rem', color: '#0D2B55' }}>Payment Successful!</h1>
      <p style={{ fontSize: '1.2rem', color: '#2C3E50', marginBottom: '2rem' }}>
        Thank you for shopping with ShopEase Ghana
      </p>

      {orderDetails && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>Order ID:</span>
            <span style={{ color: '#0D2B55' }}>{orderDetails.orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>Payment Reference:</span>
            <span style={{ color: '#0D2B55', wordBreak: 'break-all' }}>{orderDetails.reference}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>Amount Paid:</span>
            <span style={{ color: '#0D2B55', fontWeight: 'bold' }}>₵ {orderDetails.amount > 0 ? orderDetails.amount.toFixed(2) : '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>Status:</span>
            <span style={{ 
              backgroundColor: '#1F8A9C', 
              color: '#FFFFFF', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Processing
            </span>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: '#EBF5FB',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '500px',
        margin: '0 auto 2rem',
        border: '1px solid #AED6F1'
      }}>
        <p style={{ color: '#1A5276', margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
          📦 Estimated Delivery: 3-5 business days
        </p>
        <p style={{ color: '#2C3E50', margin: 0, fontSize: '0.95rem' }}>
          You will receive an SMS confirmation shortly
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/products')}
          style={{ 
            backgroundColor: '#F0A500', 
            color: '#0D2B55', 
            padding: '12px 24px', 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            minWidth: '200px'
          }}
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            backgroundColor: '#0D2B55', 
            color: '#FFFFFF', 
            padding: '12px 24px', 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            minWidth: '200px'
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
