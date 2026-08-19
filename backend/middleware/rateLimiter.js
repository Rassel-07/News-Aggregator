/**
 * Rate Limiting Middleware
 */

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  }
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 search requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many search requests. Please slow down.'
  }
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  authLimiter,
  searchLimiter,
  generalLimiter
};
