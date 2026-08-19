/**
 * News and Discovery Routes
 */

const { Router } = require('express');
const {
  getFeed,
  getHero,
  getTrending,
  getLatest,
  getCategoryFeed,
  getStoryDetail,
  getStoryCoverage,
  searchNews,
  getSources,
  triggerRefresh
} = require('../controllers/newsController');
const { optionalAuthMiddleware, authMiddleware } = require('../middleware/authMiddleware');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.get('/', optionalAuthMiddleware, getFeed);
router.get('/hero', optionalAuthMiddleware, getHero);
router.get('/trending', optionalAuthMiddleware, getTrending);
router.get('/latest', getLatest);
router.get('/sources', getSources);
router.get('/search', searchLimiter, searchNews);
router.get('/category/:category', optionalAuthMiddleware, getCategoryFeed);
router.get('/:id', optionalAuthMiddleware, getStoryDetail);
router.get('/:id/coverage', optionalAuthMiddleware, getStoryCoverage);
router.post('/refresh', authMiddleware, triggerRefresh);

module.exports = router;
