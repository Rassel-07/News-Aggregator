import React, { useContext, useState } from 'react';
import { FiClock, FiLayers, FiRadio } from 'react-icons/fi';
import BookmarkButton from './BookmarkButton';
import { UserContext } from '../context/userContext';

export default function SecondaryStory({ article }) {
  const { setActiveStoryModal } = useContext(UserContext);
  const [imgError, setImgError] = useState(false);

  if (!article) return null;

  const clusterCount = article.storyClusterId?.sourceCount || 1;
  const hasValidImage = Boolean(article.imageUrl) && !imgError;

  const handleOpenCluster = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveStoryModal(article);
  };

  return (
    <article className="secondary-card">
      {hasValidImage ? (
        <div className="secondary-thumbnail">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="secondary-thumbnail" style={{ display: 'grid', placeItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <FiRadio size={20} style={{ color: 'var(--accent-primary)', opacity: 0.6 }} />
        </div>
      )}

      <div className="secondary-info">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span className="badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              {article.category}
            </span>
            <BookmarkButton article={article} />
          </div>

          <h3 className="secondary-title">
            <a
              href={article.canonicalUrl || article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={article.title}
            >
              {article.title}
            </a>
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {article.sourceName}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {clusterCount > 1 && (
              <button
                type="button"
                onClick={handleOpenCluster}
                className="badge badge-cluster"
                style={{ cursor: 'pointer', padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}
                title="Compare multiple source coverage"
              >
                <FiLayers size={11} /> {clusterCount}
              </button>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <FiClock size={11} />
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
