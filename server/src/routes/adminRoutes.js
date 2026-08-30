const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getUsers, updateUser } = require('../controllers/adminUserController');
const {
  getAllUniversitiesAdmin,
  updateUniversityProfile,
} = require('../controllers/adminUniversityController');
const {
  getAllIndustriesAdmin,
  updateIndustryProfile,
} = require('../controllers/adminIndustryController');

const router = express.Router();

// Every route below requires an authenticated admin — applied once here
// instead of repeating protect/authorize on each line.
router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id', updateUser);

router.get('/universities', getAllUniversitiesAdmin);
router.put('/universities/:id', updateUniversityProfile);

router.get('/industries', getAllIndustriesAdmin);
router.put('/industries/:id', updateIndustryProfile);

module.exports = router;