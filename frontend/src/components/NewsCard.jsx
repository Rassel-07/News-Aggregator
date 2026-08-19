import React, { useContext, useState } from 'react';
import { FiClock, FiLayers, FiRadio } from 'react-icons/fi';
import BookmarkButton from './BookmarkButton';
import { UserContext } from '../context/userContext';

export default function NewsCard({ article }) {
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
    <article className={`news-card ${!hasValidImage ? 'news-card-textonly' : ''}`}>
      {hasValidImage ? (
        <div className="news-card-image">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#ffffff' }}>
              {article.category}
            </span>
          </div>
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
            <BookmarkButton article={article} />
          </div>
        </div>
      ) : (
        <div className="news-card-header-minimal">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiRadio size={10} /> {article.category}
            </span>
            <BookmarkButton article={article} />
          </div>
        </div>
      )}

      <div className="news-card-body">
        <h3 className="news-card-title">
          <a
            href={article.canonicalUrl || article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={article.title}
          >
            {article.title}
          </a>
        </h3>

        {article.description && (
          <p className="news-card-excerpt">{article.description}</p>
        )}

        <div className="news-card-footer">
          <div className="source-info">
            {article.sourceLogo && (
              <img
                src={article.sourceLogo}
                alt=""
                className="source-logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {article.sourceName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {clusterCount > 1 && (
              <button
                type="button"
                onClick={handleOpenCluster}
                className="badge badge-cluster"
                style={{ cursor: 'pointer', padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                title="Compare multiple source coverage"
              >
                <FiLayers size={11} /> {clusterCount} Sources
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
