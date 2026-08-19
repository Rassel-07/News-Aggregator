import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiBookmark,
  FiUser,
  FiLogOut,
  FiSliders,
  FiMenu,
  FiX,
  FiCompass,
  FiInfo
} from 'react-icons/fi';
import { UserContext } from '../context/userContext';
import ThemeToggle from './ThemeToggle';

export default function TopNav({ onOpenSearch }) {
  const { currentUser, logout, bookmarkedIds } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setIsProfileDropdownOpen(false);
    if (isProfileDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="top-nav">
      <div className="app-container top-nav-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <span className="brand-dot" />
          <span>Aura<strong style={{ fontWeight: 800 }}>News</strong></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/discover" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Discover
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Saved
            {bookmarkedIds.size > 0 && (
              <span
                style={{
                  marginLeft: '0.4rem',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {bookmarkedIds.size}
              </span>
            )}
          </NavLink>
          <NavLink to="/sources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Sources
          </NavLink>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="nav-actions">
          {/* Instant Search Trigger */}
          <Link
            to="/search"
            className="btn-icon"
            title="Search news (or press /)"
            aria-label="Search news"
          >
            <FiSearch size={17} />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-text)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
                title={currentUser.name}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '3rem',
                    right: 0,
                    width: '220px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    animation: 'scaleUp 180ms ease'
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {currentUser.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.6rem 0.8rem' }}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <FiUser size={15} /> Reader Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.6rem 0.8rem' }}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <FiSliders size={15} /> Topic Preferences
                  </Link>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      padding: '0.6rem 0.8rem',
                      color: 'var(--danger)'
                    }}
                    onClick={handleLogout}
                  >
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: 'none' }}
            aria-label="Toggle navigation"
            id="mobile-nav-toggle"
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bg-canvas)',
            zIndex: 150,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <Link
            to="/"
            className="btn btn-secondary"
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
          >
            Home Feed
          </Link>
          <Link
            to="/discover"
            className="btn btn-secondary"
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
          >
            <FiCompass /> Discover Categories
          </Link>
          <Link
            to="/saved"
            className="btn btn-secondary"
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
          >
            <FiBookmark /> Saved Articles ({bookmarkedIds.size})
          </Link>
          <Link
            to="/sources"
            className="btn btn-secondary"
            onClick={() => setIsMenuOpen(false)}
            style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
          >
            <FiInfo /> Sources & Attribution
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="btn btn-secondary"
                onClick={() => setIsMenuOpen(false)}
                style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
              >
                <FiUser /> Profile
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                <FiLogOut /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '1rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
