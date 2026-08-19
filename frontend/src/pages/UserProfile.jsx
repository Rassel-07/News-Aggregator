import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiBookmark,
  FiShield,
  FiSliders,
  FiCheckCircle,
  FiAlertCircle,
  FiLogOut
} from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function UserProfile() {
  const { currentUser, logout, setCurrentUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get('/users/profile');
        if (isMounted && res.data) {
          setProfileData(res.data.user);
          setFormData(prev => ({
            ...prev,
            name: res.data.user.name || '',
            avatar: res.data.user.avatar || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatusMessage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await axios.patch('/users/profile', formData);
      setProfileData(res.data.user);
      if (setCurrentUser) {
        setCurrentUser(prev => ({ ...prev, name: res.data.user.name, avatar: res.data.user.avatar }));
      }
      setStatusMessage({ type: 'success', text: 'Profile updated successfully.' });
      setEditing(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="app-container" style={{ padding: '4rem 0', maxWidth: '720px' }}>
        <div className="skeleton" style={{ width: '100%', height: '220px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const user = profileData || currentUser;
  const categories = user?.preferences?.categories || [];

  return (
    <div className="app-container" style={{ padding: '3.5rem 0 6rem 0', maxWidth: '780px' }}>
      {/* Profile Header Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-primary)',
            fontSize: '1.75rem',
            fontWeight: 800,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0
          }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          ) : (
            user.name?.charAt(0).toUpperCase()
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1 className="serif-headline" style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>
            {user.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user.email}
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Reader since {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="btn btn-secondary btn-sm"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)' }}
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: statusMessage.type === 'success' ? 'var(--success-subtle)' : 'var(--danger-subtle)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}
        >
          {statusMessage.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Edit Form */}
      {editing ? (
        <form
          onSubmit={handleUpdate}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Edit Profile Details
          </h2>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <input
              type="url"
              name="avatar"
              className="form-input"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatar}
              onChange={handleChange}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Change Password (Optional)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ marginTop: '1rem', padding: '0.8rem 1.5rem' }}
          >
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </form>
      ) : null}

      {/* Reader Statistics & Session Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            <FiBookmark size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Reading Library
            </span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {profileData?.stats?.savedArticlesCount || 0}
          </p>
          <Link to="/saved" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            View saved articles →
          </Link>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            <FiShield size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Session Security
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            24h Inactivity Protection
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Sessions automatically expire after 24 hours of inactivity for security.
          </p>
        </div>
      </div>

      {/* Selected Topics Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Your Topic Interests ({categories.length})
          </h2>
          <Link to="/settings" className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
            <FiSliders size={13} /> Customize
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <span key={cat} className="badge badge-accent" style={{ padding: '0.4rem 0.8rem' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
