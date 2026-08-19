/**
 * Bookmark Routes
 */

const { Router } = require('express');
const {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  getBookmarkedIds
} = require('../controllers/bookmarkController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', getBookmarks);
router.get('/ids', getBookmarkedIds);
router.post('/:articleId', saveBookmark);
router.delete('/:articleId', removeBookmark);

module.exports = router;
