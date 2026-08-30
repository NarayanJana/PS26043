const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'challenge_approved',
        'challenge_assigned',
        'project_update',
        'milestone_completed',
        'industry_interest',
        'general',
      ],
      default: 'general',
    },
    relatedChallenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', default: null },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);