/**
 * Authentication Controller (Zero-Dependency Standalone Mode)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');
const { generateId, store, persistStore } = require('../services/storageService');

const JWT_SECRET = process.env.JWT_SECRET || 'news_aggregator_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  const id = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    {
      id,
      name: user.name,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, preferences } = req.body;

    if (!name || !email || !password) {
      return next(new HttpError('Please provide your name, email, and password.', 422));
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 6) {
      return next(new HttpError('Password must be at least 6 characters long.', 422));
    }

    if (confirmPassword && password !== confirmPassword) {
      return next(new HttpError('Passwords do not match.', 422));
    }

    if (store.users.has(normalizedEmail)) {
      return next(new HttpError('An account with this email address already exists.', 409));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = generateId();

    const newUser = {
      _id: userId,
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: '',
      preferences: preferences || {
        categories: ['Technology', 'AI', 'World', 'Science', 'Business'],
        countries: ['US', 'GB', 'IN'],
        languages: ['en'],
        theme: 'system'
      },
      onboardingCompleted: false,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.users.set(normalizedEmail, newUser);
    persistStore();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        preferences: newUser.preferences,
        onboardingCompleted: newUser.onboardingCompleted,
        lastActivityAt: newUser.lastActivityAt
      }
    });
  } catch (error) {
    return next(new HttpError('Registration failed: ' + error.message, 500));
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError('Please provide both email and password.', 422));
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = store.users.get(normalizedEmail);

    if (!user) {
      // Auto-create initial account for ease of testing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = generateId();

      user = {
        _id: userId,
        id: userId,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: hashedPassword,
        avatar: '',
        preferences: {
          categories: ['Technology', 'AI', 'World', 'Science', 'Business'],
          countries: ['US', 'GB', 'IN'],
          languages: ['en'],
          theme: 'system'
        },
        onboardingCompleted: false,
        lastActivityAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      store.users.set(normalizedEmail, user);
      persistStore();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new HttpError('Invalid email or password.', 401));
      }
      user.lastActivityAt = new Date();
      persistStore();
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Signed in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        onboardingCompleted: user.onboardingCompleted,
        lastActivityAt: user.lastActivityAt
      }
    });
  } catch (error) {
    return next(new HttpError('Login failed: ' + error.message, 500));
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.status(200).json({ message: 'Signed out successfully.' });
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

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
            lastActivityAt: u.lastActivityAt
          }
        });
      }
    }

    res.status(200).json({ user: req.user });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

// POST /api/auth/ping
const pingActivity = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      for (const u of store.users.values()) {
        if (u._id.toString() === req.user.id.toString() || u.id === req.user.id) {
          u.lastActivityAt = new Date();
          persistStore();
        }
      }
    }
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  } catch (err) {
    res.status(200).json({ status: 'ok' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  pingActivity
};
