import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowLeft,
  FiExternalLink,
  FiClock,
  FiBookOpen,
  FiLayers,
  FiShare2
} from 'react-icons/fi';
import BookmarkButton from '../components/BookmarkButton';
import NewsCard from '../components/NewsCard';

export default function StoryOverview() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStory = async () => {
      try {
        setLoading(true);
        const [storyRes, coverageRes] = await Promise.all([
          axios.get(`/news/${id}`),
          axios.get(`/news/${id}/coverage`)
        ]);

        if (isMounted) {
          setArticle(storyRes.data.article);
          setRelated(storyRes.data.related || []);
          setCoverage(coverageRes.data.coverage || []);
        }
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStory();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
        <div className="skeleton" style={{ width: '100px', height: '24px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '40px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '80%', height: '40px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '360px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 className="serif-headline">Story Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          This story may have expired or been removed.
        </p>
        <Link to="/" className="btn btn-primary">Return to Home Feed</Link>
      </div>
    );
  }

  return (
    <article className="app-container" style={{ padding: '3rem 0 6rem 0', maxWidth: '880px' }}>
      {/* Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}
        >
          <FiArrowLeft size={16} /> Back to Feed
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleShare}
            className="btn-icon"
            title="Copy story link"
          >
            <FiShare2 size={16} />
          </button>
          <BookmarkButton article={article} />
        </div>
      </div>

      {copied && (
        <div
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--success-subtle)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          Story link copied to clipboard!
        </div>
      )}

      {/* Category & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span className="badge badge-accent">{article.category}</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {article.sourceLogo && <img src={article.sourceLogo} alt="" style={{ width: '16px', height: '16px', borderRadius: '3px' }} />}
          {article.sourceName}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <FiClock size={12} /> {new Date(article.publishedAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <FiBookOpen size={12} /> {article.readingTimeMinutes || 2} min read
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="serif-headline" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1.18, marginBottom: '1.5rem' }}>
        {article.title}
      </h1>

      {/* Main Thumbnail */}
      {article.imageUrl && (
        <div
          style={{
            width: '100%',
            height: '420px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '2rem',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Overview Summary Box */}
      <div
        style={{
          padding: '1.75rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem'
        }}
      >
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Aggregated Excerpt & Summary
        </h3>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          {article.description || 'Summary excerpt provided by source RSS feed metadata.'}
        </p>

        {/* Big External Link CTA */}
        <a
          href={article.canonicalUrl || article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.9rem 1.5rem', width: '100%', fontSize: '0.95rem' }}
        >
          <span>Read complete story at <strong>{article.sourceName}</strong></span>
          <FiExternalLink size={18} />
        </a>
      </div>

      {/* Multi-Source Coverage Section */}
      {coverage.length > 1 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FiLayers size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              Coverage Across {coverage.length} Outlets
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {coverage.map((item, idx) => (
              <div
                key={item._id || idx}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {item.sourceName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</h4>
                <a
                  href={item.canonicalUrl || item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ paddingLeft: 0, color: 'var(--accent-primary)', fontWeight: 700 }}
                >
                  <span>Read on {item.sourceName}</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Stories */}
      {related.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            More in {article.category}
          </h2>
          <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {related.slice(0, 3).map((item, idx) => (
              <NewsCard key={item._id || idx} article={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
