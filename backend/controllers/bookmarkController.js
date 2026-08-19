/**
 * Bookmark Controller (Zero-Dependency Standalone Mode)
 */

const HttpError = require('../models/errorModel');
const { findArticleById, store, persistStore } = require('../services/storageService');

// GET /api/bookmarks
const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 18;
    const skip = (page - 1) * limit;

    const userBookmarks = [];
    for (const [key, b] of store.bookmarks.entries()) {
      if (b.userId === userId) {
        const article = await findArticleById(b.articleId);
        if (article) {
          userBookmarks.push({
            ...article,
            bookmarkId: key,
            savedAt: b.savedAt
          });
        }
      }
    }

    userBookmarks.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    const paginated = userBookmarks.slice(skip, skip + limit);

    res.status(200).json({
      bookmarks: paginated,
      page,
      totalPages: Math.ceil(userBookmarks.length / limit) || 1,
      total: userBookmarks.length,
      hasMore: skip + paginated.length < userBookmarks.length
    });
  } catch (error) {
    return next(new HttpError('Failed to fetch bookmarks: ' + error.message, 500));
  }
};

// POST /api/bookmarks/:articleId
const saveBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const article = await findArticleById(articleId);
    if (!article) {
      return next(new HttpError('Article not found.', 404));
    }

    const key = `${userId}:${articleId}`;
    store.bookmarks.set(key, { userId, articleId, savedAt: new Date() });
    persistStore();

    res.status(201).json({
      message: 'Article bookmarked.',
      bookmark: {
        id: key,
        articleId,
        savedAt: new Date()
      }
    });
  } catch (error) {
    return next(new HttpError('Failed to save bookmark: ' + error.message, 500));
  }
};

// DELETE /api/bookmarks/:articleId
const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    store.bookmarks.delete(`${userId}:${articleId}`);
    persistStore();

    res.status(200).json({
      message: 'Bookmark removed.',
      articleId
    });
  } catch (error) {
    return next(new HttpError('Failed to remove bookmark: ' + error.message, 500));
  }
};

// GET /api/bookmarks/ids
const getBookmarkedIds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ids = [];

    for (const b of store.bookmarks.values()) {
      if (b.userId === userId) {
        ids.push(b.articleId.toString());
      }
    }

    res.status(200).json({ bookmarkedIds: ids });
  } catch (error) {
    return next(new HttpError('Failed to fetch bookmark IDs: ' + error.message, 500));
  }
};

module.exports = {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  getBookmarkedIds
};
