import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, AtSign, Share2 } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-col">
          <h3>About ShopEase</h3>
          <p>
            Shop Smarter, Live Better. We are your one-stop shop for thousands 
            of quality products at unbeatable prices, committed to delivering 
            the best shopping experience.
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul className="contact-info">
            <li>
              <Mail size={16} /> support@shopease.com.gh
            </li>
            <li>
              <Phone size={16} /> +233 30 123 4567
            </li>
            <li>
              <MapPin size={16} /> 14 Independence Avenue, Accra, Ghana
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><Globe /></a>
            <a href="#" aria-label="Twitter"><AtSign /></a>
            <a href="#" aria-label="Instagram"><Share2 /></a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <div className="container">
          &copy; 2026 ShopEase Ghana. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
