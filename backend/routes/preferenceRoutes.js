/**
 * Preference Routes
 */

const { Router } = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferenceController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', getPreferences);
router.patch('/', updatePreferences);

module.exports = router;
