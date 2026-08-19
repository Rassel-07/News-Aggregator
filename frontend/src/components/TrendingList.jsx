import React, { useContext } from 'react';
import { FiTrendingUp, FiLayers } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function TrendingList({ trending = [] }) {
  const { setActiveStoryModal } = useContext(UserContext);

  if (!trending || trending.length === 0) return null;

  return (
    <section className="trending-section" aria-label="Trending stories">
      <div className="trending-header">
        <FiTrendingUp style={{ color: 'var(--accent-primary)' }} size={20} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Trending Stories Right Now
        </h2>
      </div>

      <div className="trending-grid">
        {trending.map((item, idx) => {
          const article = item.article || item;
          const clusterCount = item.sourceCount || 1;

          return (
            <div key={item.clusterId || article?._id || idx} className="trending-item">
              <span className="trending-rank">{item.rank || String(idx + 1).padStart(2, '0')}</span>

              <div className="trending-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    {item.category || article?.category}
                  </span>
                  {clusterCount > 1 && (
                    <span
                      className="badge badge-cluster"
                      style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', cursor: 'pointer' }}
                      onClick={() => article && setActiveStoryModal(article)}
                    >
                      <FiLayers size={10} /> {clusterCount} Sources
                    </span>
                  )}
                </div>

                <h3 className="trending-title">
                  <a
                    href={article?.canonicalUrl || article?.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.title || article?.title}
                  >
                    {item.title || article?.title}
                  </a>
                </h3>

                <div className="trending-meta">
                  <span>{article?.sourceName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
