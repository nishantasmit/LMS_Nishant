import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../services/authService';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const logoRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with credentials:', { ...credentials, password: '[HIDDEN]' });
      const user = await login(credentials);
      console.log('Login successful:', { ...user, token: '[HIDDEN]' });
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username);
      authLogin(user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img
        ref={logoRef}
        src="/indian-railways-logo.png"
        alt="Indian Railways Logo"
        className="login-bg-logo"
        draggable={false}
      />
      {/* Train Animation Background */}
      <div className="train-background">
        <div className="train-track"></div>
        <div className="train">
          <div className="train-body">
            <div className="train-window"></div>
            <div className="train-window"></div>
            <div className="train-window"></div>
          </div>
          <div className="train-head">
            <div className="train-light"></div>
          </div>
          <div className="train-wheels">
            <div className="wheel"></div>
            <div className="wheel"></div>
            <div className="wheel"></div>
            <div className="wheel"></div>
          </div>
          <div className="smoke-particles">
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-icon">🚂</div>
        <div className="floating-icon">📬</div>
        <div className="floating-icon">📋</div>
        <div className="floating-icon">🔍</div>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="main-logo">🚂</div>
            <h1>Railway Board</h1>
            <h2>Letter Monitoring System</h2>
          </div>
          <p className="welcome-text">Welcome back! Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Enter your username"
                required
                className="login-input"
              />
              <div className="input-line"></div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="login-input"
              />
              <div className="input-line"></div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="security-badge">
            <span>🔐</span>
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;