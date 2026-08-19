import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiSearch, FiX } from 'react-icons/fi';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/NewsSkeleton';
import { CATEGORIES } from '../components/CategoryNav';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [dateRange, setDateRange] = useState('');
  const [sort, setSort] = useState('newest');
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search query
  const performSearch = useCallback(
    async (query, cat, date, sortBy) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (cat && cat !== 'All') params.append('category', cat);
        if (date) params.append('dateRange', date);
        if (sortBy) params.append('sort', sortBy);
        params.append('page', 1);
        params.append('limit', 20);

        const res = await axios.get(`/news/search?${params.toString()}`);
        setArticles(res.data.articles || []);
        setTotal(res.data.total || 0);
        setHasSearched(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Trigger search on parameter changes with debounce for keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm, category, dateRange, sort);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, category, dateRange, sort, performSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setCategory('All');
    setDateRange('');
  };

  return (
    <div className="app-container" style={{ padding: '3rem 0 6rem 0' }}>
      {/* Search Header */}
      <div style={{ maxWidth: '780px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '0.5rem' }}>
          Search the News
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Instant, metadata-indexed search across hundreds of verified reporting sources.
        </p>

        {/* Input Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--border-medium)',
            borderRadius: 'var(--radius-pill)',
            padding: '0.5rem 1.25rem',
            boxShadow: 'var(--shadow-md)',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <FiSearch size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginRight: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search keywords, companies, topics, or publishers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'grid', placeItems: 'center' }}
              title="Clear search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
          >
            <option value="">Any Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {(searchTerm || category !== 'All' || dateRange) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {hasSearched ? `Search Results (${total})` : 'Recent Top Stories'}
          </h2>
          {searchTerm && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Query: “{searchTerm}”
            </span>
          )}
        </div>

        {loading ? (
          <NewsGridSkeleton count={6} />
        ) : articles.length > 0 ? (
          <div className="news-grid">
            {articles.map((article, idx) => (
              <NewsCard key={article._id || idx} article={article} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              No stories found for "{searchTerm}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try searching with broader terms or exploring recommended topics:
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['OpenAI', 'NASA', 'Semiconductors', 'Climate', 'Global Markets', 'Football'].map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSearchTerm(topic)}
                  className="category-pill"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
