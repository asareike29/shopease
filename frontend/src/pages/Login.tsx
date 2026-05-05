import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ email, password, full_name: name });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card shadow">
        
        <div className="auth-header">
          <h2>ShopEase</h2>
          <p>Login to your account or create a new one.</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(null); }}
          >
            Register
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button type="button" className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="forgot-pwd">
                <a href="#">Forgot Password?</a>
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : 'Login'}
            </button>
            
            <div className="auth-divider"><span>or continue with</span></div>
            
            <button type="button" className="btn-secondary google-btn">
              Google
            </button>

            <div className="auth-switch">
              Don't have an account? <span onClick={() => { setActiveTab('register'); setError(null); }}>Register</span>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button type="button" className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the Terms & Conditions
            </label>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : 'Create Account'}
            </button>
            
            <div className="auth-switch">
              Already have an account? <span onClick={() => { setActiveTab('login'); setError(null); }}>Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
