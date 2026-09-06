const Notification = require('../models/Notification');
const User = require('../models/User');

// Maps each Notification "type" (defined back in Stage 4's schema) to the
// specific toggle that controls it. "general" has no toggle of its own —
// it's gated by systemNotifications, matching what the Settings UI calls
// "System Notifications."
const TYPE_TO_PREFERENCE = {
  challenge_approved: 'challengeUpdates',
  challenge_assigned: 'challengeUpdates',
  project_update: 'projectUpdates',
  milestone_completed: 'projectUpdates',
  industry_interest: 'collaborationRequests',
  general: 'systemNotifications',
};

const createNotification = async ({
  recipient,
  title,
  message,
  type = 'general',
  relatedChallenge = null,
  relatedProject = null,
}) => {
  try {
    const preferenceKey = TYPE_TO_PREFERENCE[type] || 'systemNotifications';

    const user = await User.findById(recipient).select('settings');
    if (!user) {
      console.error(`Notification skipped: recipient ${recipient} not found`);
      return;
    }

    // Defensive default: if an older document somehow lacks the settings
    // subdocument entirely (shouldn't happen given the schema default,
    // but .select() on a raw findById can behave unexpectedly on legacy
    // data), default to allowing the notification rather than silently
    // dropping it.
    const allowed = user.settings?.notifications?.[preferenceKey] ?? true;

    if (!allowed) {
      return; // Respecting the user's preference — not an error, just a no-op.
    }

    await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedChallenge,
      relatedProject,
    });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { createNotification };