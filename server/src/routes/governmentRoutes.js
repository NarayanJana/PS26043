const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAnalytics,
  getGovernmentChallenges,
  getGovernmentProjects,
  validateChallenge,
} = require('../controllers/governmentController');

const router = express.Router();

router.get('/analytics', protect, authorize('government', 'admin'), getAnalytics);
router.get('/challenges', protect, authorize('government', 'admin'), getGovernmentChallenges);
router.get('/projects', protect, authorize('government', 'admin'), getGovernmentProjects);
router.post(
  '/challenges/:id/validate',
  protect,
  authorize('government', 'admin'),
  validateChallenge
);

module.exports = router;