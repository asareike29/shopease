import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const itemsPerPage = 4;
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter([category]);
    }
  }, [location]);

  // Fetch products automatically when deps change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getAllProducts({
          category: categoryFilter.length > 0 ? categoryFilter.join(',') : undefined,
          maxPrice: priceRange,
          sort: sortBy,
          page: currentPage,
          limit: itemsPerPage
        });
        setProducts(response.data);
        setTotalCount(response.total);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter, priceRange, sortBy, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleCategoryChange = (category: string) => {
    setCurrentPage(1); // Reset page on filter change
    setCategoryFilter(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports'];

  return (
    <div className="product-list-page">
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
        </div>
      </div>

      <div className="container product-list-layout">
        <button 
          className="mobile-filter-btn hidden-desktop" 
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? 'Hide Filters' : 'Show Filters'}
        </button>
        {/* Sidebar */}
        <aside className={`filters-sidebar ${showSidebar ? 'show' : ''} shadow`}>
          <div className="filter-group">
            <h3>Category</h3>
            {categories.map(cat => (
              <label key={cat} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={categoryFilter.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="checkmark"></span>
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Max Price: ${priceRange}</h3>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={priceRange} 
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1); // Reset page
              }}
              className="price-slider"
            />
          </div>

        </aside>

        {/* Main Content */}
        <main className="product-list-content">
          <div className="product-list-bar">
            <span className="results-count">Showing {totalCount} results</span>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset page
              }}
              className="sort-select shadow"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="products-grid">
            {loading ? (
              <LoadingSpinner size="large" />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="no-results">No products match your filters.</div>
            )}
          </div>

          {!loading && !error && totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'page-btn active' : 'page-btn'}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
