const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Project = require('../models/Project');
const University = require('../models/University');
const { createNotification } = require('../services/notificationService');

const VALIDATED_OR_BEYOND = [
  'validated',
  'university_assigned',
  'project_created',
  'prototype',
  'pilot',
  'deployed',
];

const buildChallengeMatch = (query) => {
  const { district, domain, status, dateFrom, dateTo } = query;
  const match = {};
  if (district) match.district = new RegExp(district, 'i');
  if (domain) match.domain = domain;
  if (status) match.status = status;
  if (dateFrom || dateTo) {
    match.createdAt = {};
    if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
    if (dateTo) match.createdAt.$lte = new Date(dateTo);
  }
  return match;
};

const getAnalytics = async (req, res) => {
  try {
    const match = buildChallengeMatch(req.query);

    const [
      totalChallenges,
      validatedChallenges,
      deployedSolutions,
      activeProjects,
      completedProjects,
      byDistrict,
      byDomain,
      byStatus,
      byUniversity,
      byIndustry,
      byProjectStatus,
      impactByDomain,
      universitiesInvolved,
      industryPartnersInvolved,
      impactTotal,
    ] = await Promise.all([
      Challenge.countDocuments(match),
      Challenge.countDocuments({ ...match, status: { $in: VALIDATED_OR_BEYOND } }),
      Challenge.countDocuments({ ...match, status: 'deployed' }),
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'completed' }),

      Challenge.aggregate([
        { $match: match },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Challenge.aggregate([
        { $match: match },
        { $group: { _id: '$domain', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Challenge.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      Challenge.aggregate([
        { $match: { ...match, assignedUniversity: { $ne: null } } },
        {
          $lookup: {
            from: 'universities',
            localField: 'assignedUniversity',
            foreignField: '_id',
            as: 'uni',
          },
        },
        { $unwind: '$uni' },
        { $group: { _id: '$uni.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Project.aggregate([
        { $unwind: '$industryPartners' },
        {
          $lookup: {
            from: 'industrypartners',
            localField: 'industryPartners.partner',
            foreignField: '_id',
            as: 'partnerDoc',
          },
        },
        { $unwind: '$partnerDoc' },
        { $group: { _id: '$partnerDoc.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

      Project.aggregate([
        {
          $lookup: {
            from: 'challenges',
            localField: 'challenge',
            foreignField: '_id',
            as: 'challengeDoc',
          },
        },
        { $unwind: '$challengeDoc' },
        {
          $group: {
            _id: '$challengeDoc.domain',
            peopleImpacted: { $sum: '$socialImpact.peopleImpacted' },
          },
        },
        { $match: { peopleImpacted: { $gt: 0 } } },
        { $sort: { peopleImpacted: -1 } },
      ]),

      Challenge.distinct('assignedUniversity', { ...match, assignedUniversity: { $ne: null } }),

      Project.aggregate([
        { $unwind: '$industryPartners' },
        { $group: { _id: '$industryPartners.partner' } },
      ]),

      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$socialImpact.peopleImpacted' } } },
      ]),
    ]);

    res.status(200).json({
      stats: {
        totalChallenges,
        validatedChallenges,
        activeProjects,
        completedProjects,
        deployedSolutions,
        universitiesInvolved: universitiesInvolved.length,
        industryPartners: industryPartnersInvolved.length,
        citizensBenefited: impactTotal[0]?.total || 0,
      },
      charts: {
        challengesByDistrict: byDistrict.map((d) => ({ label: d._id || 'Unknown', value: d.count })),
        challengesByDomain: byDomain.map((d) => ({ label: d._id || 'Unknown', value: d.count })),
        challengeStatus: byStatus.map((d) => ({ label: d._id, value: d.count })),
        universityParticipation: byUniversity.map((d) => ({ label: d._id, value: d.count })),
        industryParticipation: byIndustry.map((d) => ({ label: d._id, value: d.count })),
        projectCompletion: byProjectStatus.map((d) => ({ label: d._id, value: d.count })),
        socialImpactByDomain: impactByDomain.map((d) => ({
          label: d._id || 'Unknown',
          value: d.peopleImpacted,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGovernmentChallenges = async (req, res) => {
  try {
    const match = buildChallengeMatch(req.query);
    const challenges = await Challenge.find(match)
      .populate('assignedUniversity', 'name district')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ challenges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGovernmentProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('challenge', 'title domain district')
      .populate('university', 'name district')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    if (!['submitted', 'ai_analysis'].includes(challenge.status)) {
      return res
        .status(400)
        .json({ message: `Cannot validate a challenge with status "${challenge.status}"` });
    }

    challenge.status = 'validated';
    await challenge.save();

    createNotification({
      recipient: challenge.submittedBy,
      title: 'Challenge approved',
      message: `Your challenge "${challenge.title}" has been approved.`,
      type: 'challenge_approved',
      relatedChallenge: challenge._id,
    });

    res.status(200).json({ challenge });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getGovernmentChallenges,
  getGovernmentProjects,
  validateChallenge,
};