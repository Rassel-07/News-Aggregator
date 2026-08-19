import React, { useContext } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useContext(UserContext);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-icon ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
    </button>
  );
}
