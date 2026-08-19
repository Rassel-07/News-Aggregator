import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiFileText } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '5rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '3.5rem 0 2rem 0'
      }}
    >
      <div className="app-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="nav-brand" style={{ fontSize: '1.25rem' }}>
              <span className="brand-dot" />
              <span>Aura<strong>News</strong></span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              A modern, intelligent news discovery platform aggregating headlines and metadata from legitimate publishers worldwide.
            </p>
          </div>

          {/* Quick Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              Top Categories
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Link to="/category/technology">Technology</Link>
              <Link to="/category/ai">Artificial Intelligence</Link>
              <Link to="/category/business">Business</Link>
              <Link to="/category/world">World News</Link>
              <Link to="/category/science">Science & Space</Link>
              <Link to="/category/india">India</Link>
            </div>
          </div>

          {/* Legal & Attribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              Aggregation & Legal
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Link to="/sources" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiFileText size={13} /> Source Attribution & Rights
              </Link>
              <Link to="/sources" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiShield size={13} /> Aggregation Policy
              </Link>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Original journalism belongs to respective publishers.
              </span>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <span>&copy; {new Date().getFullYear()} AuraNews Platform. All rights reserved.</span>
          <span>Designed with editorial precision & privacy respect.</span>
        </div>
      </div>
    </footer>
  );
}