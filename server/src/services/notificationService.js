const Notification = require('../models/Notification');

const createNotification = async ({
  recipient,
  title,
  message,
  type = 'general',
  relatedChallenge = null,
  relatedProject = null,
}) => {
  try {
    await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedChallenge,
      relatedProject,
    });
  } catch (error) {
    // Notifications are a side effect, not the main action — a failure
    // here should never crash the request that triggered it.
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { createNotification };