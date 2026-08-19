import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSliders, FiSun, FiMoon, FiCheck, FiShield } from 'react-icons/fi';
import { UserContext } from '../context/userContext';
import { CATEGORIES } from '../components/CategoryNav';

export default function SettingsPage() {
  const { currentUser, updatePreferences, theme, setTheme } = useContext(UserContext);
  const [selectedCategories, setSelectedCategories] = useState(
    currentUser?.preferences?.categories || ['Technology', 'AI', 'World', 'Science', 'Business']
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length <= 2) return;
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      await updatePreferences({ categories: selectedCategories, theme });
      setMessage('Preferences saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const availableCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="app-container" style={{ padding: '3.5rem 0 6rem 0', maxWidth: '780px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '0.5rem' }}>
          Reader Preferences & Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Customize your discovery ranking, reading theme, and account settings.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: 'var(--success-subtle)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          {message}
        </div>
      )}

      {/* Theme Setting */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Appearance & Theme
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Select how AuraNews looks on your device.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { id: 'light', label: 'Light Theme', icon: <FiSun size={18} /> },
            { id: 'dark', label: 'Dark Theme', icon: <FiMoon size={18} /> },
            { id: 'system', label: 'System Default', icon: <FiSliders size={18} /> }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${theme === t.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                backgroundColor: theme === t.id ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                color: theme === t.id ? 'var(--accent-text)' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {t.icon}
                <span>{t.label}</span>
              </div>
              {theme === t.id && <FiCheck style={{ color: 'var(--accent-primary)' }} />}
            </button>
          ))}
        </div>
      </section>

      {/* Topic Ranking Preferences */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Preferred Topics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Stories in your selected topics will receive a positive ranking multiplier in your home feed.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {availableCategories.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{cat}</span>
                {isSelected && <FiCheck style={{ color: 'var(--accent-primary)' }} />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '0.8rem 2rem' }}
        >
          {saving ? 'Saving...' : 'Save Preferred Topics'}
        </button>
      </section>

      {/* Security & 24h Inactivity Policy Info */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          <FiShield size={20} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Session Security Policy
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          AuraNews implements a strict <strong>24-hour inactivity session timeout</strong>. If your account does not record meaningful activity for 24 continuous hours, your session key is automatically invalidated server-side to protect your privacy and saved stories.
        </p>
      </section>
    </div>
  );
}
