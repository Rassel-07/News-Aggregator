import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiAlertCircle, FiCompass } from 'react-icons/fi';
import { UserContext } from '../context/userContext';
import CategoryNav from '../components/CategoryNav';
import HeroStory from '../components/HeroStory';
import SecondaryStory from '../components/SecondaryStory';
import NewsCard from '../components/NewsCard';
import TrendingList from '../components/TrendingList';
import { HeroSkeleton, NewsGridSkeleton, TrendingSkeleton } from '../components/NewsSkeleton';
import OnboardingModal from '../components/OnboardingModal';

export default function Home() {
  const { currentUser } = useContext(UserContext);
  const [heroData, setHeroData] = useState({ leadStory: null, secondaryStories: [] });
  const [trending, setTrending] = useState([]);
  const [feedArticles, setFeedArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Check onboarding for logged in users
  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted === false) {
      setShowOnboarding(true);
    }
  }, [currentUser]);

  // Fetch initial home content
  useEffect(() => {
    let isMounted = true;
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [heroRes, trendingRes, feedRes] = await Promise.all([
          axios.get('/news/hero'),
          axios.get('/news/trending?limit=5'),
          axios.get('/news?page=1&limit=12')
        ]);

        if (isMounted) {
          setHeroData(heroRes.data || { leadStory: null, secondaryStories: [] });
          setTrending(trendingRes.data.trending || []);
          setFeedArticles(feedRes.data.articles || []);
          setHasMore(feedRes.data.hasMore ?? false);
          setPage(1);
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Home] Failed to load news feed:', err);
          setError('Some news sources are temporarily unavailable. Showing available feeds.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.preferences]);

  // Load more articles
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await axios.get(`/news?page=${nextPage}&limit=12`);
      const newArticles = res.data.articles || [];

      setFeedArticles(prev => [...prev, ...newArticles]);
      setPage(nextPage);
      setHasMore(res.data.hasMore ?? false);
    } catch (err) {
      console.warn('Failed to load more stories:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Category Scrolling Ticker */}
      <CategoryNav activeCategory="All" />

      <div className="app-container" style={{ marginTop: '2rem' }}>
        {/* Personalized Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="serif-headline" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginTop: '0.2rem' }}>
              {getGreeting()}{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}.
            </h1>
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <FiCompass /> Edit Topics
            </button>
          )}
        </div>

        {/* Error / Provider Notification */}
        {error && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.88rem'
            }}
          >
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Hero News Section */}
        {loading ? (
          <HeroSkeleton />
        ) : heroData.leadStory ? (
          <div className="hero-grid">
            <HeroStory article={heroData.leadStory} />
            <div className="hero-secondary-column">
              {heroData.secondaryStories.map((story, i) => (
                <SecondaryStory key={story._id || i} article={story} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Trending Section */}
        {loading ? (
          <TrendingSkeleton />
        ) : (
          <TrendingList trending={trending} />
        )}

        {/* Top Stories / Latest Editorial Feed */}
        <section style={{ marginTop: '4rem' }} aria-label="Latest discovery feed">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Top Stories & Latest Discovery
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Curated from verified RSS feeds
            </span>
          </div>

          {loading ? (
            <NewsGridSkeleton count={6} />
          ) : feedArticles.length > 0 ? (
            <>
              <div className="news-grid">
                {feedArticles.map((article, idx) => (
                  <NewsCard key={article._id || idx} article={article} />
                ))}
              </div>

              {/* Infinite / Load More Button */}
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
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No stories available</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Feeds are currently synchronizing. Please check back in a few moments.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Interactive Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}
