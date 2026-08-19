import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import CategoryNav from '../components/CategoryNav';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/NewsSkeleton';

export default function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort, setSort] = useState('latest');

  const formattedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Technology';

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/news/category/${formattedCategory}?page=1&limit=15&sort=${sort}`);
        if (isMounted) {
          setArticles(res.data.articles || []);
          setTotal(res.data.total || 0);
          setHasMore(res.data.hasMore ?? false);
          setPage(1);
        }
      } catch (err) {
        console.error('Failed to load category feed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryFeed();
    return () => {
      isMounted = false;
    };
  }, [formattedCategory, sort]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await axios.get(`/news/category/${formattedCategory}?page=${nextPage}&limit=15&sort=${sort}`);
      const newArticles = res.data.articles || [];

      setArticles(prev => [...prev, ...newArticles]);
      setPage(nextPage);
      setHasMore(res.data.hasMore ?? false);
    } catch (err) {
      console.warn('Failed to load more category stories:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <CategoryNav activeCategory={formattedCategory} />

      <div className="app-container" style={{ marginTop: '2.5rem' }}>
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            to="/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '0.75rem'
            }}
          >
            <FiArrowLeft size={14} /> Back to Discover
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: '0.4rem' }}>
                Topic Feed
              </span>
              <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
                {formattedCategory} News
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {total} stories aggregated from top global publishers.
              </p>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <button
                type="button"
                onClick={() => setSort('latest')}
                className={`btn btn-sm ${sort === 'latest' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => setSort('popular')}
                className={`btn btn-sm ${sort === 'popular' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Popular
              </button>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <NewsGridSkeleton count={9} />
        ) : articles.length > 0 ? (
          <>
            <div className="news-grid">
              {articles.map((article, idx) => (
                <NewsCard key={article._id || idx} article={article} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn btn-secondary btn-pill"
                  style={{ padding: '0.8rem 2.5rem', fontWeight: 700 }}
                >
                  {loadingMore ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiRefreshCw className="spin" /> Loading more stories...
                    </span>
                  ) : (
                    'Load More Stories'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              No stories found in {formattedCategory}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We could not find recent articles matching this category.
            </p>
            <Link to="/" className="btn btn-primary">
              Return to Home Feed
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
