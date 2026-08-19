import React, { useContext, useState } from 'react';
import { FiClock, FiBookOpen, FiLayers, FiExternalLink } from 'react-icons/fi';
import BookmarkButton from './BookmarkButton';
import { UserContext } from '../context/userContext';

export default function HeroStory({ article }) {
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
    <article className="hero-lead-card">
      {hasValidImage ? (
        <div className="hero-image-wrapper">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="eager"
            onError={() => setImgError(true)}
          />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
            <span className="badge badge-accent">{article.category}</span>
          </div>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <BookmarkButton article={article} />
          </div>
        </div>
      ) : (
        <div style={{ padding: '1.25rem 1.5rem 0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="badge badge-accent">{article.category}</span>
          <BookmarkButton article={article} />
        </div>
      )}

      <div className="hero-content">
        <div className="hero-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {article.sourceLogo && (
              <img
                src={article.sourceLogo}
                alt=""
                style={{ width: '16px', height: '16px', borderRadius: '3px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            {article.sourceName}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiClock size={12} />
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiBookOpen size={12} />
            {article.readingTimeMinutes || 2} min read
          </span>
        </div>

        <h2 className="serif-headline hero-title">
          <a
            href={article.canonicalUrl || article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={article.title}
          >
            {article.title}
          </a>
        </h2>

        {article.description && (
          <p className="hero-description">{article.description}</p>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
          {clusterCount > 1 ? (
            <button
              type="button"
              onClick={handleOpenCluster}
              className="badge badge-cluster"
              style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
            >
              <FiLayers size={13} /> Compare {clusterCount} Sources
            </button>
          ) : (
            <div />
          )}

          <a
            href={article.canonicalUrl || article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ fontWeight: 700, color: 'var(--accent-primary)', gap: '0.3rem' }}
          >
            <span>Read on {article.sourceName}</span>
            <FiExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  );
}
