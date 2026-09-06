const express = require('express');
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  changePassword,
  getMySettings,
  updateNotificationSettings,
  updatePrivacySettings,
  logoutAllDevices,
  deleteMyAccount,
} = require('../controllers/userController');

const router = express.Router();

router.put('/me/profile', protect, updateProfile);
router.put('/me/password', protect, changePassword);
router.get('/me/settings', protect, getMySettings);
router.put('/me/notifications', protect, updateNotificationSettings);
router.put('/me/privacy', protect, updatePrivacySettings);
router.post('/me/logout-all', protect, logoutAllDevices);
router.delete('/me', protect, deleteMyAccount);

module.exports = router;