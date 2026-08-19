import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          padding: '3rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <FiAlertTriangle size={42} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <h1 className="serif-headline" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {error?.statusText || error?.message || 'The story or section you requested could not be located.'}
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          Return to Home Feed
        </Link>
      </div>
    </div>
  );
}