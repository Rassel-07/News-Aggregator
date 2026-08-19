import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5001/api';
axios.defaults.baseURL = API_BASE_URL;

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('aura_token') || null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aura_theme') || 'dark';
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [inactivityAlert, setInactivityAlert] = useState(null);
  const [activeStoryModal, setActiveStoryModal] = useState(null);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  // Set default axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('aura_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('aura_token');
    }
  }, [token]);

  // Save current user state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [currentUser]);

  // Setup Axios Interceptors for 24-Hour Inactivity Catch
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401 && data && data.code === 'SESSION_INACTIVE') {
            console.warn('[Session] 24-hour inactivity limit reached. Logging out.');
            setCurrentUser(null);
            setToken(null);
            setBookmarkedIds(new Set());
            setInactivityAlert(
              data.message || 'Your session expired after 24 hours of inactivity. Please sign in again.'
            );
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch bookmarked IDs on login
  const fetchBookmarks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/bookmarks/ids');
      if (res.data && Array.isArray(res.data.bookmarkedIds)) {
        setBookmarkedIds(new Set(res.data.bookmarkedIds));
      }
    } catch (err) {
      console.warn('Could not fetch bookmarked IDs:', err.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token, fetchBookmarks]);

  // Login handler
  const login = (userData, userToken) => {
    setCurrentUser(userData);
    setToken(userToken);
    setInactivityAlert(null);
  };

  // Logout handler
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    setCurrentUser(null);
    setToken(null);
    setBookmarkedIds(new Set());
  };

  // Toggle Bookmark helper (optimistic UI)
  const toggleBookmark = async (article) => {
    if (!token) {
      return { success: false, requireAuth: true };
    }

    const articleId = article._id || article.id;
    const isCurrentlySaved = bookmarkedIds.has(articleId);

    // Optimistically update set
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      return next;
    });

    try {
      if (isCurrentlySaved) {
        await axios.delete(`/bookmarks/${articleId}`);
      } else {
        await axios.post(`/bookmarks/${articleId}`);
      }
      return { success: true, saved: !isCurrentlySaved };
    } catch (error) {
      // Revert on error
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(articleId);
        } else {
          next.delete(articleId);
        }
        return next;
      });
      return { success: false, error: error.message };
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences, onboardingCompleted = true) => {
    try {
      const res = await axios.patch('/preferences', {
        ...newPreferences,
        onboardingCompleted
      });
      if (currentUser) {
        setCurrentUser(prev => ({
          ...prev,
          preferences: res.data.preferences,
          onboardingCompleted: res.data.onboardingCompleted
        }));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const dismissInactivityAlert = () => {
    setInactivityAlert(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,
        login,
        logout,
        theme,
        setTheme,
        bookmarkedIds,
        toggleBookmark,
        fetchBookmarks,
        updatePreferences,
        inactivityAlert,
        dismissInactivityAlert,
        activeStoryModal,
        setActiveStoryModal,
        apiBaseUrl: API_BASE_URL
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;