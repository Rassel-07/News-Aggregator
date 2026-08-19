import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiCompass,
  FiArrowRight,
  FiCpu,
  FiGlobe,
  FiTrendingUp,
  FiActivity,
  FiSun,
  FiZap,
  FiAward,
  FiTv,
  FiLayers,
  FiRadio,
  FiFeather
} from 'react-icons/fi';
import { CATEGORIES } from '../components/CategoryNav';

const CATEGORY_METADATA = {
  Technology: {
    description: 'Hardware, software, gadgets, and tech industry movements.',
    icon: <FiCpu size={26} />,
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: '#3b82f6'
  },
  AI: {
    description: 'Machine learning, frontier models, generative AI, and automation.',
    icon: <FiZap size={26} />,
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
    color: '#8b5cf6'
  },
  Science: {
    description: 'Physics, biology, discoveries, and breakthroughs reshaping understanding.',
    icon: <FiActivity size={26} />,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
    color: '#10b981'
  },
  Business: {
    description: 'Markets, corporate strategy, global finance, and economics.',
    icon: <FiTrendingUp size={26} />,
    gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)',
    color: '#f59e0b'
  },
  World: {
    description: 'Geopolitics, diplomacy, international developments, and global events.',
    icon: <FiGlobe size={26} />,
    gradient: 'linear-gradient(135deg, #164e63 0%, #06b6d4 100%)',
    color: '#06b6d4'
  },
  India: {
    description: 'National developments, economy, policy, infrastructure, and culture in India.',
    icon: <FiSun size={26} />,
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)',
    color: '#f97316'
  },
  Politics: {
    description: 'Government, policy, elections, legislative debate, and global civic affairs.',
    icon: <FiFeather size={26} />,
    gradient: 'linear-gradient(135deg, #881337 0%, #ef4444 100%)',
    color: '#ef4444'
  },
  Sports: {
    description: 'Football, basketball, cricket, racing, athletics, and championships.',
    icon: <FiAward size={26} />,
    gradient: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)',
    color: '#14b8a6'
  },
  Entertainment: {
    description: 'Cinema, television, music, culture, and creative arts.',
    icon: <FiTv size={26} />,
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
    color: '#ec4899'
  },
  Gaming: {
    description: 'Video games, consoles, esports, game development, and reviews.',
    icon: <FiLayers size={26} />,
    gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    color: '#a855f7'
  },
  Startups: {
    description: 'Venture funding, new founders, product launches, and scale-ups.',
    icon: <FiTrendingUp size={26} />,
    gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
    color: '#6366f1'
  },
  Health: {
    description: 'Medicine, public health, neuroscience, wellness, and medical science.',
    icon: <FiActivity size={26} />,
    gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
    color: '#22c55e'
  },
  Climate: {
    description: 'Clean energy, biodiversity, environmental policy, and Earth science.',
    icon: <FiSun size={26} />,
    gradient: 'linear-gradient(135deg, #365314 0%, #84cc16 100%)',
    color: '#84cc16'
  },
  Space: {
    description: 'Astrophysics, telescope discoveries, planetary missions, and space exploration.',
    icon: <FiRadio size={26} />,
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)',
    color: '#38bdf8'
  }
};

export default function Discover() {
  const filteredCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="app-container" style={{ padding: '3rem 0 6rem 0' }}>
      {/* Header */}
      <div style={{ maxWidth: '680px', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          <FiCompass size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Discover Topics
          </span>
        </div>
        <h1 className="serif-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.75rem' }}>
          Explore the world’s most compelling journalism.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Browse curated topic hubs aggregating verified reporting from hundreds of legitimate global newsrooms.
        </p>
      </div>

      {/* Category Discovery Tiles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filteredCategories.map(cat => {
          const meta = CATEGORY_METADATA[cat] || {
            description: `Top stories and latest breaking news in ${cat}.`,
            icon: <FiCompass size={26} />,
            gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'var(--accent-primary)'
          };

          return (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="news-card"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {/* Vibrant Gradient Header with Icon */}
              <div
                style={{
                  height: '110px',
                  background: meta.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(4px)',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    {meta.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    {cat}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  flexGrow: 1,
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flexGrow: 1 }}>
                  {meta.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: meta.color
                  }}
                >
                  <span>Explore {cat} Stories</span>
                  <FiArrowRight size={14} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
