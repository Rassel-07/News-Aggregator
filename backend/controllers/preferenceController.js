/**
 * User Preferences Controller (Zero-Dependency Standalone Mode)
 */

const HttpError = require('../models/errorModel');
const { CATEGORIES } = require('../config/newsSources');
const { store, persistStore } = require('../services/storageService');

// GET /api/preferences
const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;

    for (const u of store.users.values()) {
      if (u._id.toString() === userId.toString() || u.id === userId) {
        return res.status(200).json({
          preferences: u.preferences,
          onboardingCompleted: u.onboardingCompleted,
          availableCategories: CATEGORIES
        });
      }
    }

    res.status(200).json({
      preferences: req.user.preferences || {},
      onboardingCompleted: req.user.onboardingCompleted || false,
      availableCategories: CATEGORIES
    });
  } catch (error) {
    return next(new HttpError('Failed to load preferences: ' + error.message, 500));
  }
};

// PATCH /api/preferences
const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { categories, countries, languages, theme, onboardingCompleted } = req.body;

    for (const u of store.users.values()) {
      if (u._id.toString() === userId.toString() || u.id === userId) {
        if (categories && Array.isArray(categories)) u.preferences.categories = categories;
        if (countries && Array.isArray(countries)) u.preferences.countries = countries;
        if (languages && Array.isArray(languages)) u.preferences.languages = languages;
        if (theme && ['light', 'dark', 'system'].includes(theme)) u.preferences.theme = theme;
        if (typeof onboardingCompleted === 'boolean') u.onboardingCompleted = onboardingCompleted;
        u.lastActivityAt = new Date();
        persistStore();

        return res.status(200).json({
          message: 'Preferences updated successfully.',
          preferences: u.preferences,
          onboardingCompleted: u.onboardingCompleted
        });
      }
    }

    res.status(200).json({
      message: 'Preferences updated.',
      preferences: { categories: categories || [] },
      onboardingCompleted: Boolean(onboardingCompleted)
    });
  } catch (error) {
    return next(new HttpError('Failed to update preferences: ' + error.message, 500));
  }
};

module.exports = {
  getPreferences,
  updatePreferences
};
