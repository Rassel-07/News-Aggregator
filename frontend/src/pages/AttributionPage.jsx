import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

export default function AttributionPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSources = async () => {
      try {
        const res = await axios.get('/news/sources');
        if (isMounted && res.data) {
          setSources(res.data.sources || []);
        }
      } catch (e) {
        console.warn('Could not fetch source list');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSources();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-container" style={{ padding: '3.5rem 0 6rem 0', maxWidth: '820px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          <FiShield size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Legal & Source Transparency
          </span>
        </div>
        <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '0.75rem' }}>
          Attribution & Content Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          How AuraNews aggregates headlines, respects copyright, and credits original journalism.
        </p>
      </div>

      {/* Policy Box */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Our Aggregation Principles</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} size={18} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Legitimate Feeds Only:</strong> We aggregate metadata exclusively from publicly provided RSS/Atom feeds and permitted publisher discovery interfaces.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} size={18} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>No Unauthorized Full Text Copying:</strong> We do not copy, mirror, or republish complete copyrighted article bodies. We display only brief excerpts/headlines to facilitate discovery.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} size={18} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Direct Traffic to Originating Publishers:</strong> Every article card and story overview provides direct, prominent links to read the full report at the original publisher's website.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} size={18} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>No Paywall / Access Bypass:</strong> We do not bypass paywalls, authentication screens, anti-bot protections, or CAPTCHAs.
            </div>
          </div>
        </div>
      </div>

      {/* Registered News Sources Directory */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem'
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Configured Newsroom Directory
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Verified publishers whose public RSS feeds are indexed in our discovery engine:
        </p>

        {loading ? (
          <div className="skeleton" style={{ height: '140px', width: '100%' }} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {sources.map(source => (
              <div
                key={source.id || source.name}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {source.name}
                  </strong>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>
                    {source.category}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {source.domain} ({source.country})
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
