import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { UserContext } from '../context/userContext';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/NewsSkeleton';

export default function SavedPage() {
  const { currentUser, bookmarkedIds } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const fetchSavedStories = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get('/bookmarks?limit=50');
        if (isMounted) {
          setBookmarks(res.data.bookmarks || []);
        }
      } catch (err) {
        console.error('Failed to load saved stories:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSavedStories();
    return () => {
      isMounted = false;
    };
  }, [currentUser, bookmarkedIds]);

  if (!currentUser) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '460px',
            margin: '0 auto',
            padding: '3rem 2rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <FiBookmark size={36} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h2 className="serif-headline" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Sign In to View Saved Stories
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Save articles across devices and build your personal reading list.
          </p>
          <Link to="/login?redirect=saved" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In to AuraNews
          </Link>
        </div>
      </div>
    );
  }

  // Extract unique categories from saved articles
  const categoriesInBookmarks = ['All', ...new Set(bookmarks.map(b => b.category).filter(Boolean))];

  const filteredBookmarks = selectedCategory === 'All'
    ? bookmarks
    : bookmarks.filter(b => b.category === selectedCategory);

  return (
    <div className="app-container" style={{ padding: '3rem 0 6rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
            <FiBookmark size={18} />
            <span style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Reading List
            </span>
          </div>
          <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Saved Stories
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {bookmarks.length} {bookmarks.length === 1 ? 'story' : 'stories'} saved to your library.
          </p>
        </div>

        {/* Category Filters */}
        {categoriesInBookmarks.length > 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categoriesInBookmarks.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <NewsGridSkeleton count={6} />
      ) : filteredBookmarks.length > 0 ? (
        <div className="news-grid">
          {filteredBookmarks.map((article, idx) => (
            <NewsCard key={article._id || idx} article={article} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <FiBookmark size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Your reading list is empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click the bookmark icon on any story to save it for offline reading or later reference.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Current Stories
          </Link>
        </div>
      )}
    </div>
  );
}
