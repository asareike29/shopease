import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <div className="page-header contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Please fill out the form below or use our contact information.</p>
        </div>
      </div>

      <div className="container contact-container">
        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-form-section shadow">
            <h2>Send us a Message</h2>
            {isSubmitted && (
              <div className="success-message">
                Thank you! We will get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button type="submit" className="btn-primary submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="info-card shadow">
              <div className="info-icon"><Mail size={24} /></div>
              <div className="info-content">
                <h3>Email Us</h3>
                <p>support@shopease.com</p>
              </div>
            </div>
            <div className="info-card shadow">
              <div className="info-icon"><Phone size={24} /></div>
              <div className="info-content">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-card shadow">
              <div className="info-icon"><MapPin size={24} /></div>
              <div className="info-content">
                <h3>Visit Us</h3>
                <p>123 Commerce St, New York, NY 10001</p>
              </div>
            </div>
            <div className="info-card shadow">
              <div className="info-icon"><Clock size={24} /></div>
              <div className="info-content">
                <h3>Business Hours</h3>
                <p>Mon-Fri: 9am - 6pm EST<br/>Sat-Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
