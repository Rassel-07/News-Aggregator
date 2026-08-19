/**
 * Authentication Routes
 */

const { Router } = require('express');
const { register, login, logout, getMe, pingActivity } = require('../controllers/authController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.post('/ping', optionalAuthMiddleware, pingActivity);

module.exports = router;
