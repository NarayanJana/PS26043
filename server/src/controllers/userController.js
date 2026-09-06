const User = require('../models/User');
const University = require('../models/University');
const IndustryPartner = require('../models/IndustryPartner');
const Notification = require('../models/Notification');

const getMySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const editableKeys = [
      'challengeUpdates',
      'projectUpdates',
      'collaborationRequests',
      'systemNotifications',
      'emailNotifications',
    ];

    editableKeys.forEach((key) => {
      if (typeof req.body[key] === 'boolean') {
        user.settings.notifications[key] = req.body[key];
      }
    });

    await user.save();
    res.status(200).json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'This email is already in use' });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Deliberately not accepting role or organization here — role is
    // never user-editable, and organization is set at registration and
    // mirrored into the University/IndustryPartner profile documents
    // (Stages 10/11); editing it here would desync those records. That's
    // a real follow-up for a future stage, not an oversight.

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

       const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save(); // triggers the existing pre('save') bcrypt hook

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrivacySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { profileVisibility, showContactInfo } = req.body;

    if (profileVisibility !== undefined) {
      if (!['public', 'anonymous'].includes(profileVisibility)) {
        return res.status(400).json({ message: 'Invalid profileVisibility value' });
      }
      user.settings.privacy.profileVisibility = profileVisibility;
    }
    if (typeof showContactInfo === 'boolean') {
      user.settings.privacy.showContactInfo = showContactInfo;
    }

    await user.save();
    res.status(200).json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({ message: 'Logged out of all devices.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    const { password, confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ message: 'Type DELETE to confirm account deletion.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete your account.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    if (user.role === 'admin') {
      const activeAdminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: 'You are the last active admin. Promote another account to admin before deleting this one.',
        });
      }
    }

    const anonymizedEmail = `deleted-${user._id}@deleted.sociosolve.local`;

    if (user.role === 'university') {
      await University.updateOne(
        { user: user._id },
        {
          contactPerson: 'Deleted User',
          contactEmail: anonymizedEmail,
          contactPhone: '',
        }
      );
    }

    if (user.role === 'industry') {
      await IndustryPartner.updateOne(
        { user: user._id },
        {
          contactPerson: 'Deleted User',
          contactEmail: anonymizedEmail,
          contactPhone: '',
        }
      );
    }

    await Notification.deleteMany({ recipient: user._id });

    user.name = 'Deleted User';
    user.email = anonymizedEmail;
    user.phone = '';
    user.organization = undefined;
    user.isActive = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({ message: 'Account deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getMySettings,
  updateNotificationSettings,
  updatePrivacySettings,
  logoutAllDevices,
  deleteMyAccount,
};