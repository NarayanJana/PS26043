const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createChallenge,
    getMyChallenges,
    getChallenges,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
} = require('../controllers/challengeController');
const { triggerAnalysis, getAnalysis } = require('../controllers/aiController');
const { getSimilarChallenges } = require('../controllers/similarityController');
const {
    acceptChallenge,
    rejectChallenge,
} = require('../controllers/universityDashboardController');
const getUniversityProfile = require('../middleware/getUniversityProfile');

const router = express.Router();

router.post(
    '/',
    protect,
    authorize('citizen'),
    upload.fields([
        { name: 'photos', maxCount: 5 },
        { name: 'videos', maxCount: 2 },
        { name: 'documents', maxCount: 5 },
    ]),
    createChallenge
);

router.get('/my-challenges', protect, authorize('citizen'), getMyChallenges);
router.get('/', protect, getChallenges);
router.get('/:id', protect, getChallengeById);
router.put('/:id', protect, updateChallenge);
router.delete('/:id', protect, deleteChallenge);

router.post('/:id/analyze', protect, triggerAnalysis);
router.get('/:id/ai-analysis', protect, getAnalysis);
router.get('/:id/similar', protect, getSimilarChallenges);

router.post(
    '/:id/accept',
    protect,
    authorize('university'),
    getUniversityProfile,
    acceptChallenge
);
router.post(
    '/:id/reject',
    protect,
    authorize('university'),
    getUniversityProfile,
    rejectChallenge
);

module.exports = router;