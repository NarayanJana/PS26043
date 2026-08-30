const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const { status, progress, notes, dueDate } = req.body;
    const wasAlreadyCompleted = milestone.status === 'completed';

    if (status !== undefined) {
      milestone.status = status;
      if (status === 'completed') milestone.completedDate = new Date();
    }
    if (progress !== undefined) milestone.progress = progress;
    if (notes !== undefined) milestone.notes = notes;
    if (dueDate !== undefined) milestone.dueDate = dueDate;

    await milestone.save();

    if (status === 'completed' && !wasAlreadyCompleted) {
      const project = await Project.findById(milestone.project);
      const governmentUsers = await User.find({ role: 'government' }).select('_id');

      governmentUsers.forEach((govUser) => {
        createNotification({
          recipient: govUser._id,
          title: 'Milestone completed',
          message: `Project milestone has been completed: "${milestone.stage}" on ${project?.title || 'a project'}.`,
          type: 'milestone_completed',
          relatedProject: milestone.project,
        });
      });
    }

    res.status(200).json({ milestone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateMilestone };