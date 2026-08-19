import React from 'react';
import { FiClock, FiExternalLink } from 'react-icons/fi';
import BookmarkButton from './BookmarkButton';

export default function CompactNewsCard({ article }) {
  if (!article) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 0',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
            {article.category}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {article.sourceName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h4 style={{ fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.35 }}>
          <a
            href={article.canonicalUrl || article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={article.title}
          >
            {article.title}
          </a>
        </h4>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <BookmarkButton article={article} />
      </div>
    </div>
  );
}
