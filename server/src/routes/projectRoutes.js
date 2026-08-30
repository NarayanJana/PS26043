const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const getUniversityProfile = require('../middleware/getUniversityProfile');
const upload = require('../middleware/upload');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addProjectUpdate,
  uploadProjectDocuments,
  updateIndustryPartnerStatus,
} = require('../controllers/projectController');
const { updateMilestone } = require('../controllers/milestoneController');
//const { updateIndustryPartnerStatus } = require('../controllers/projectController');
const router = express.Router();

router.post('/', protect, authorize('university'), getUniversityProfile, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, authorize('university'), getUniversityProfile, updateProject);

router.post('/:id/updates', protect, addProjectUpdate);
router.post(
  '/:id/documents',
  protect,
  upload.array('documents', 5),
  uploadProjectDocuments
);

router.put('/:id/milestones/:milestoneId', protect, authorize('university'), updateMilestone);

router.put(
  '/:id/industry/:partnerId',
  protect,
  authorize('university'),
  getUniversityProfile,
  updateIndustryPartnerStatus
);
module.exports = router;