import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import type { Product } from '../types';
import { mockReviews } from '../utils/mockData';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        
        // Fetch related products (mocking related logic by getting category)
        try {
          const related = await productService.getAllProducts({ category: data.category, limit: 5 });
          setRelatedProducts(related.products.filter((p: Product) => p.id !== id).slice(0, 4));
        } catch (e) {
          // Ignore related products failure
        }
      } catch (err: any) {
        setError(err.message || 'Product Not Found');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}><LoadingSpinner size="large" /></div>;
  }

  if (error || !product) {
    return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}><ErrorMessage message={error || 'Product Not Found'} /></div>;
  }

  const reviews = mockReviews.filter(r => r.product_id === id);
  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      if (isLoggedIn) {
        await cartService.addToCart({ product_id: product.id, quantity });
      }
      addToCart(product, quantity);
    } catch (err) {
      console.error('Failed to add to API cart', err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{product.name}</span>
        </div>

        {/* Main Details */}
        <div className="product-main">
          
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image_url} alt={product.name} />
            </div>
            <div className="thumbnail-list">
              {[1,2,3,4].map((i) => (
                <div key={i} className="thumbnail shadow">
                  <img src={product.image_url} alt="Thumbnail" />
                </div>
              ))}
            </div>
          </div>

          <div className="product-details">
            <h1 className="detail-name">{product.name}</h1>
            
            <div className="detail-rating">
              <div className="stars">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} size={18} fill={star <= 4 ? "var(--gold)" : "none"} color="var(--gold)" />
                ))}
              </div>
              <span className="review-count">(4.5/5 from 128 Reviews)</span>
            </div>

            <div className="detail-price">${product.price.toFixed(2)}</div>
            
            <p className="detail-description">{product.description}</p>
            
            <div className="detail-stock">
              <span className={`stock-indicator ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
              {product.stock_quantity} in stock
            </div>

            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)} disabled={addingToCart}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={addingToCart}>+</button>
              </div>
              <button 
                className="btn-primary add-btn" 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
              >
                {addingToCart ? <LoadingSpinner size="small" /> : 'Add to Cart'}
              </button>
            </div>
            
            <button className="btn-secondary wishlist-btn">Add to Wishlist</button>
            
          </div>
        </div>

        {/* Tabs section */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({displayReviews.length})
            </button>
          </div>
          
          <div className="tab-content shadow">
            {activeTab === 'description' && (
              <p>{product.description} This product is made with the highest quality materials to ensure durability and customer satisfaction. It is designed to meet the rigorous demands of everyday use while maintaining an elegant aesthetic.</p>
            )}
            {activeTab === 'specifications' && (
              <ul className="specs-list">
                <li><strong>Weight:</strong> 1.2 lbs</li>
                <li><strong>Dimensions:</strong> 10 x 5 x 3 inches</li>
                <li><strong>Material:</strong> Premium materials</li>
                <li><strong>Warranty:</strong> 1 Year Manufacturer Warranty</li>
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className="reviews-list">
                {displayReviews.map(review => (
                  <div key={review.id} className="review-item border-bottom">
                    <div className="review-header">
                      <strong>{review.user_name}</strong>
                      <div className="stars">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} size={14} fill={star <= review.rating ? "var(--gold)" : "none"} color="var(--gold)" />
                        ))}
                      </div>
                    </div>
                    <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-grid products-grid">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
