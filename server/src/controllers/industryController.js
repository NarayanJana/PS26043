const Project = require('../models/Project');
const University = require('../models/University');
const { createNotification } = require('../services/notificationService');

const getOpportunities = async (req, res) => {
  try {
    const industryId = req.industry._id;

    const opportunities = await Project.find({
      status: 'active',
      'industryPartners.partner': { $ne: industryId },
    })
      .populate('challenge', 'title domain district peopleAffected')
      .populate('university', 'name district')
      .sort({ createdAt: -1 });

    res.status(200).json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const industryId = req.industry._id;

    const allInvolved = await Project.find({ 'industryPartners.partner': industryId })
      .populate('challenge', 'title domain district')
      .populate('university', 'name district');

    const pending = [];
    const active = [];
    const completed = [];
    const supportProvided = new Set();

    allInvolved.forEach((project) => {
      const entry = project.industryPartners.find(
        (ip) => ip.partner.toString() === industryId.toString()
      );
      if (!entry) return;

      const summary = {
        _id: project._id,
        title: project.title,
        challenge: project.challenge,
        university: project.university,
        supportType: entry.supportType,
        status: entry.status,
      };

      if (entry.status === 'interested') pending.push(summary);
      if (entry.status === 'active') {
        active.push(summary);
        (entry.supportType || []).forEach((t) => supportProvided.add(t));
      }
      if (entry.status === 'completed') {
        completed.push(summary);
        (entry.supportType || []).forEach((t) => supportProvided.add(t));
      }
    });

    const opportunitiesCount = await Project.countDocuments({
      status: 'active',
      'industryPartners.partner': { $ne: industryId },
    });

    res.status(200).json({
      pendingCollaborations: pending,
      activeCollaborations: active,
      completedCollaborations: completed,
      stats: {
        available: opportunitiesCount,
        pending: pending.length,
        active: active.length,
        completed: completed.length,
      },
      supportProvided: Array.from(supportProvided),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const expressInterest = async (req, res) => {
  try {
    const { projectId, supportType } = req.body;

    if (!projectId || !Array.isArray(supportType) || supportType.length === 0) {
      return res
        .status(400)
        .json({ message: 'projectId and at least one supportType are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const alreadyInvolved = project.industryPartners.some(
      (ip) => ip.partner.toString() === req.industry._id.toString()
    );
    if (alreadyInvolved) {
      return res.status(400).json({ message: 'You have already expressed interest in this project' });
    }

        project.industryPartners.push({
      partner: req.industry._id,
      supportType,
      status: 'interested',
    });

    await project.save();

    const university = await University.findById(project.university);
    if (university) {
      createNotification({
        recipient: university.user,
        title: 'Industry interest received',
        message: `${req.industry.name} has expressed interest in your project "${project.title}".`,
        type: 'industry_interest',
        relatedProject: project._id,
      });
    }

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOpportunities, getDashboard, expressInterest };