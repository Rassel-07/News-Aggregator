/**
 * Reader User Routes
 */

const { Router } = require('express');
const { getProfile, updateProfile } = require('../controllers/userProfileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

module.exports = router;