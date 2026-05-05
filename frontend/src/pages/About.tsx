import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Truck, HeartHandshake } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-title">About ShopEase</h1>
          <p className="hero-subtitle">
            Empowering small and medium businesses to thrive online since 2024
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            At ShopEase, our mission is to revolutionize the e-commerce landscape by bridging the gap between quality products and everyday consumers. We believe in providing a seamless, secure, and delightful shopping experience. By partnering with small and medium enterprises, we help local businesses scale their reach while delivering unparalleled value to our global customer base.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-card">
            <h3>1000+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3>4.8/5</h3>
            <p>Rating</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card shadow">
              <div className="value-icon"><Award size={40} /></div>
              <h3>Quality Products</h3>
              <p>We handpick every item to ensure it meets our strict quality standards.</p>
            </div>
            <div className="value-card shadow">
              <div className="value-icon"><Truck size={40} /></div>
              <h3>Fast Delivery</h3>
              <p>Our optimized logistics network ensures your package arrives on time.</p>
            </div>
            <div className="value-card shadow">
              <div className="value-icon"><HeartHandshake size={40} /></div>
              <h3>24/7 Support</h3>
              <p>Our dedicated team is always here to assist you with any questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to start shopping?</h2>
          <Link to="/products" className="btn-primary cta-btn">
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
