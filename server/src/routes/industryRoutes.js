const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const getIndustryProfile = require('../middleware/getIndustryProfile');
const { getOpportunities, getDashboard, expressInterest } = require('../controllers/industryController');

const router = express.Router();

router.get(
  '/opportunities',
  protect,
  authorize('industry'),
  getIndustryProfile,
  getOpportunities
);
router.get('/dashboard', protect, authorize('industry'), getIndustryProfile, getDashboard);
router.post(
  '/collaborate',
  protect,
  authorize('industry'),
  getIndustryProfile,
  expressInterest
);

module.exports = router;