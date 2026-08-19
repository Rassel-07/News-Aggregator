/**
 * Reader User Profile Controller (Zero-Dependency Standalone Mode)
 */

const bcrypt = require('bcryptjs');
const HttpError = require('../models/errorModel');
const { store, persistStore } = require('../services/storageService');

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let count = 0;
    for (const b of store.bookmarks.values()) {
      if (b.userId === userId) count++;
    }

    for (const u of store.users.values()) {
      if (u._id.toString() === userId.toString() || u.id === userId) {
        return res.status(200).json({
          user: {
            id: u._id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            preferences: u.preferences,
            onboardingCompleted: u.onboardingCompleted,
            lastActivityAt: u.lastActivityAt,
            createdAt: u.createdAt,
            stats: {
              savedArticlesCount: count
            }
          }
        });
      }
    }

    res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        preferences: req.user.preferences,
        stats: { savedArticlesCount: 0 }
      }
    });
  } catch (error) {
    return next(new HttpError('Failed to load profile: ' + error.message, 500));
  }
};

// PATCH /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, avatar, currentPassword, newPassword, confirmNewPassword } = req.body;

    for (const u of store.users.values()) {
      if (u._id.toString() === userId.toString() || u.id === userId) {
        if (name && name.trim()) u.name = name.trim();
        if (typeof avatar === 'string') u.avatar = avatar.trim();
        if (newPassword) {
          if (!currentPassword) return next(new HttpError('Please provide your current password.', 422));
          const isMatch = await bcrypt.compare(currentPassword, u.password);
          if (!isMatch) return next(new HttpError('Current password is incorrect.', 400));
          if (newPassword.length < 6) return next(new HttpError('New password must be at least 6 characters long.', 422));
          if (newPassword !== confirmNewPassword) return next(new HttpError('New passwords do not match.', 422));
          const salt = await bcrypt.genSalt(10);
          u.password = await bcrypt.hash(newPassword, salt);
        }
        u.lastActivityAt = new Date();
        persistStore();

        let count = 0;
        for (const b of store.bookmarks.values()) {
          if (b.userId === userId) count++;
        }

        return res.status(200).json({
          message: 'Profile updated successfully.',
          user: {
            id: u._id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            preferences: u.preferences,
            onboardingCompleted: u.onboardingCompleted,
            lastActivityAt: u.lastActivityAt,
            createdAt: u.createdAt,
            stats: { savedArticlesCount: count }
          }
        });
      }
    }

    res.status(200).json({ message: 'Profile updated.' });
  } catch (error) {
    return next(new HttpError('Failed to update profile: ' + error.message, 500));
  }
};

module.exports = {
  getProfile,
  updateProfile
};
