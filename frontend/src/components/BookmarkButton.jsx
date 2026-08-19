import React, { useContext } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

export default function BookmarkButton({ article, className = '' }) {
  const { bookmarkedIds, toggleBookmark, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const articleId = article?._id || article?.id;
  const isSaved = bookmarkedIds.has(articleId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/login?redirect=bookmark');
      return;
    }

    await toggleBookmark(article);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-icon ${className}`}
      title={isSaved ? 'Remove from Saved' : 'Save for later'}
      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark story'}
      style={{
        color: isSaved ? 'var(--accent-primary)' : 'var(--text-muted)'
      }}
    >
      {isSaved ? <FaBookmark size={15} /> : <FiBookmark size={16} />}
    </button>
  );
}
