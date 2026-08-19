import React, { useState, useEffect, useContext } from 'react';
import { FiX, FiExternalLink, FiClock, FiLayers } from 'react-icons/fi';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import BookmarkButton from './BookmarkButton';

export default function StoryClusterModal({ article, onClose }) {
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveStoryModal } = useContext(UserContext);

  useEffect(() => {
    let isMounted = true;
    const fetchCoverage = async () => {
      if (!article?._id) return;
      try {
        setLoading(true);
        const res = await axios.get(`/news/${article._id}/coverage`);
        if (isMounted && res.data) {
          setCoverage(res.data.coverage || [article]);
        }
      } catch (err) {
        if (isMounted) {
          setCoverage([article]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoverage();
    return () => {
      isMounted = false;
    };
  }, [article]);

  if (!article) return null;

  const handleClose = () => {
    if (onClose) onClose();
    if (setActiveStoryModal) setActiveStoryModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-accent">{article.category}</span>
            <span className="badge badge-cluster">
              <FiLayers size={12} /> {coverage.length} {coverage.length === 1 ? 'Source' : 'Sources'} Covering
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookmarkButton article={article} />
            <button
              type="button"
              className="btn-icon"
              onClick={handleClose}
              aria-label="Close dialog"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Story Title */}
        <h2 id="story-modal-title" className="serif-headline" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
          {article.title}
        </h2>

        {/* Lead Excerpt */}
        {article.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {article.description}
          </p>
        )}

        {/* Primary Action */}
        <div style={{ marginBottom: '2rem' }}>
          <a
            href={article.canonicalUrl || article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem 1rem' }}
          >
            <span>Read full story at <strong>{article.sourceName}</strong></span>
            <FiExternalLink size={16} />
          </a>
        </div>

        {/* Multi-Source Perspective Comparison */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Coverage from Different Publishers</span>
          </h3>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="skeleton" style={{ height: '70px', width: '100%' }} />
              <div className="skeleton" style={{ height: '70px', width: '100%' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {coverage.map((item, idx) => (
                <div
                  key={item._id || idx}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.sourceLogo && (
                        <img
                          src={item.sourceLogo}
                          alt=""
                          style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                        />
                      )}
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {item.sourceName}
                      </strong>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiClock size={12} />
                      {new Date(item.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {item.title}
                  </p>

                  {item.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ marginTop: '0.25rem' }}>
                    <a
                      href={item.canonicalUrl || item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ paddingLeft: 0, color: 'var(--accent-primary)', fontWeight: 700 }}
                    >
                      <span>Open article at {item.sourceName}</span>
                      <FiExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
