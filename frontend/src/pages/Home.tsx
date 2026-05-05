import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Shirt, Home as HomeIcon, Dumbbell } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({ limit: 8 });
        setFeaturedProducts((response.data || []).slice(0, 8)); // Ensure 8 even if mock ignores limit
      } catch (err: any) {
        setError(err.message || 'Failed to load featured products');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Monitor size={32} /> },
    { name: 'Fashion', icon: <Shirt size={32} /> },
    { name: 'Home & Living', icon: <HomeIcon size={32} /> },
    { name: 'Sports', icon: <Dumbbell size={32} /> },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Shop Smarter, Live Better</h1>
            <p>
              Discover thousands of quality products at unbeatable prices. 
              Your one-stop shop for everything you need.
            </p>
            <Link to="/products" className="btn-primary hero-btn">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.name}`} key={cat.name} className="category-card shadow">
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all-link">View All Products &rarr;</Link>
          </div>
          <div className="products-grid">
            {loading ? (
              <LoadingSpinner size="large" />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container newsletter-container">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
