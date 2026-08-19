import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, inactivityAlert } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isInactiveReason = queryParams.get('reason') === 'inactive' || Boolean(inactivityAlert);

  // If already authenticated, redirect straight to feed
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.post('/auth/login', formData);
      const { user, token } = res.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Editorial Hero Pane */}
      <div className="auth-hero-pane">
        <div>
          <div className="nav-brand" style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '3rem' }}>
            <span className="brand-dot" style={{ backgroundColor: '#60a5fa' }} />
            <span>Aura<strong>News</strong></span>
          </div>

          <div style={{ maxWidth: '440px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#93c5fd' }}>
              Editorial Intelligence
            </span>
            <h1 className="serif-headline" style={{ fontSize: '2.8rem', color: '#ffffff', marginTop: '0.5rem', lineHeight: 1.15 }}>
              Stay informed without the noise.
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginTop: '1rem', lineHeight: 1.6 }}>
              Discover stories worth your attention, clustered from verified journalism across hundreds of global publishers.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            “AuraNews delivers genuine news aggregation with full attribution and multi-source transparency.”
          </p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <div className="auth-card">
          <div>
            <h2 className="serif-headline" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Sign in to access your personalized feed and saved reading list.
            </p>
          </div>

          {/* Inactivity Alert Notification */}
          {isInactiveReason && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-text)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>Your session expired after 24 hours of inactivity. Please sign in again.</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--danger-subtle)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In to AuraNews'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don’t have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}