const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const getUniversityProfile = require('../middleware/getUniversityProfile');
const { getUniversities } = require('../controllers/universityController');
const {
  getUniversityRecommendations,
  refreshRecommendations,
} = require('../controllers/matchingController');
const { getDashboard } = require('../controllers/universityDashboardController');

const router = express.Router();

router.get('/', protect, getUniversities);
router.get('/recommendations/:challengeId', protect, getUniversityRecommendations);
router.post('/recommendations/:challengeId/refresh', protect, refreshRecommendations);

router.get('/dashboard', protect, authorize('university'), getUniversityProfile, getDashboard);

module.exports = router;