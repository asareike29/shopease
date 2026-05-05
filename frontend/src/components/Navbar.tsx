import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          ShopEase
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
        <div className={`navbar-actions ${menuOpen ? 'open' : ''}`}>
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          
          {isLoggedIn ? (
            <div className="user-menu">
              {currentUser?.role === 'admin' && isAdminPage && (
                <Link to="/admin" className="admin-link">Dashboard</Link>
              )}
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
