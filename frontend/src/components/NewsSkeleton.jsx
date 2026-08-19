import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="hero-grid" aria-hidden="true">
      <div className="hero-lead-card">
        <div className="skeleton" style={{ width: '100%', height: '340px' }} />
        <div className="hero-content" style={{ gap: '1rem' }}>
          <div className="skeleton" style={{ width: '140px', height: '20px' }} />
          <div className="skeleton" style={{ width: '90%', height: '32px' }} />
          <div className="skeleton" style={{ width: '70%', height: '32px' }} />
          <div className="skeleton" style={{ width: '100%', height: '18px' }} />
          <div className="skeleton" style={{ width: '80%', height: '18px' }} />
        </div>
      </div>

      <div className="hero-secondary-column">
        {[1, 2, 3].map(i => (
          <div key={i} className="secondary-card">
            <div className="skeleton" style={{ width: '110px', height: '95px', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div className="skeleton" style={{ width: '70px', height: '16px' }} />
              <div className="skeleton" style={{ width: '100%', height: '20px' }} />
              <div className="skeleton" style={{ width: '60%', height: '16px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }) {
  return (
    <div className="news-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="news-card">
          <div className="skeleton" style={{ width: '100%', height: '200px' }} />
          <div className="news-card-body" style={{ gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '60px', height: '18px' }} />
            <div className="skeleton" style={{ width: '95%', height: '22px' }} />
            <div className="skeleton" style={{ width: '75%', height: '22px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px' }} />
            <div className="skeleton" style={{ width: '80%', height: '14px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div className="trending-section" aria-hidden="true">
      <div className="skeleton" style={{ width: '180px', height: '24px', marginBottom: '1.5rem' }} />
      <div className="trending-grid">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
              <div className="skeleton" style={{ width: '50px', height: '14px' }} />
              <div className="skeleton" style={{ width: '90%', height: '18px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NewsSkeleton = {
  HeroSkeleton,
  NewsGridSkeleton,
  TrendingSkeleton
};

export default NewsSkeleton;
