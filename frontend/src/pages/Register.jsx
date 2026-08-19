import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

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
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.post('/auth/register', formData);
      const { user, token } = res.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              Your Personalized Newsroom
            </span>
            <h1 className="serif-headline" style={{ fontSize: '2.8rem', color: '#ffffff', marginTop: '0.5rem', lineHeight: 1.15 }}>
              Quality journalism, curated for you.
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginTop: '1rem', lineHeight: 1.6 }}>
              Build a clutter-free news feed with AI-assisted deduplication, multi-source perspectives, and cross-device bookmarks.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Privacy-first. We never sell your reading data or train unauthorized AI models on your preferences.
          </p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <div className="auth-card">
          <div>
            <h2 className="serif-headline" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
              Create your reader account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Start discovering stories tailored to your interests in seconds.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email address</label>
              <input
                id="register-email"
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

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password (min 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">Confirm password</label>
              <input
                id="register-confirm"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}