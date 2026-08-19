/**
 * Authentication and 24-Hour Inactivity Verification Middleware
 * (Zero-Dependency Standalone Mode)
 */

const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');
const { store, persistStore } = require('../services/storageService');

const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes throttle for DB update

function findUserById(userId) {
  if (!userId) return null;
  for (const u of store.users.values()) {
    if (u._id.toString() === userId.toString() || u.id === userId) {
      return u;
    }
  }
  return null;
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new HttpError('Authentication required. Please sign in.', 401));
    }

    // Verify JWT
    const jwtSecret = process.env.JWT_SECRET || 'news_aggregator_super_secret_jwt_key_2026';
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return next(new HttpError('Session expired or invalid token. Please sign in again.', 401));
    }

    const userId = decoded.id || decoded._id;
    const user = findUserById(userId);

    if (!user) {
      return next(new HttpError('User account not found. Please sign in again.', 401));
    }

    const now = Date.now();
    const lastActiveTime = user.lastActivityAt ? new Date(user.lastActivityAt).getTime() : now;
    const inactiveDuration = now - lastActiveTime;

    // Check 24-hour inactivity expiration rule
    if (inactiveDuration > INACTIVITY_LIMIT_MS) {
      return res.status(401).json({
        message: 'Your session expired after 24 hours of inactivity. Please sign in again.',
        code: 'SESSION_INACTIVE',
        lastActive: user.lastActivityAt
      });
    }

    // Throttle server-side lastActivityAt updates
    if (inactiveDuration > ACTIVITY_THROTTLE_MS) {
      user.lastActivityAt = new Date(now);
      persistStore();
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      onboardingCompleted: user.onboardingCompleted,
      avatar: user.avatar
    };

    next();
  } catch (error) {
    return next(new HttpError('Authentication failed: ' + error.message, 401));
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET || 'news_aggregator_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id || decoded._id;
    const user = findUserById(userId);

    if (user) {
      const now = Date.now();
      const lastActiveTime = user.lastActivityAt ? new Date(user.lastActivityAt).getTime() : now;
      if (now - lastActiveTime <= INACTIVITY_LIMIT_MS) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          onboardingCompleted: user.onboardingCompleted,
          avatar: user.avatar
        };
      }
    }
    next();
  } catch (err) {
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  INACTIVITY_LIMIT_MS
};