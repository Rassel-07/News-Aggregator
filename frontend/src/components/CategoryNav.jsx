import React from 'react';
import { NavLink } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Technology',
  'AI',
  'Science',
  'Business',
  'World',
  'India',
  'Politics',
  'Sports',
  'Entertainment',
  'Gaming',
  'Startups',
  'Health',
  'Climate',
  'Space'
];

export default function CategoryNav({ activeCategory = 'All' }) {
  return (
    <nav className="category-bar" aria-label="News categories">
      <div className="app-container" style={{ width: '100%' }}>
        <ul className="category-pill-list">
          {CATEGORIES.map(category => {
            const isAll = category === 'All';
            const to = isAll ? '/' : `/category/${category.toLowerCase()}`;
            const isActive = isAll
              ? activeCategory === 'All'
              : activeCategory.toLowerCase() === category.toLowerCase();

            return (
              <li key={category}>
                <NavLink
                  to={to}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                >
                  {category}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export { CATEGORIES };
