const Challenge = require('../models/Challenge');
const Project = require('../models/Project');
const { createNotification } = require('../services/notificationService');

const getDashboard = async (req, res) => {
  try {
    const universityId = req.university._id;

    const assignedChallenges = await Challenge.find({ assignedUniversity: universityId }).sort({
      createdAt: -1,
    });

    const recommendedChallenges = await Challenge.find({
      assignedUniversity: null,
      'recommendedUniversities.university': universityId,
    }).sort({ createdAt: -1 });

    const projects = await Project.find({ university: universityId });
    const activeProjects = projects.filter((p) => p.status === 'active');
    const completedProjects = projects.filter((p) => p.status === 'completed');

    const studentsInvolved = new Set();
    const facultyMentors = new Set();
    projects.forEach((p) => {
      (p.students || []).forEach((s) => studentsInvolved.add(s.email || s.name));
      if (p.facultyMentor?.email || p.facultyMentor?.name) {
        facultyMentors.add(p.facultyMentor.email || p.facultyMentor.name);
      }
    });

    res.status(200).json({
      assignedChallenges,
      recommendedChallenges,
      stats: {
        assigned: assignedChallenges.length,
        recommended: recommendedChallenges.length,
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        studentsInvolved: studentsInvolved.size,
        facultyMentors: facultyMentors.size,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    if (challenge.assignedUniversity) {
      return res.status(400).json({ message: 'This challenge is already assigned to a university' });
    }

        challenge.assignedUniversity = req.university._id;
    challenge.status = 'university_assigned';
    await challenge.save();

    createNotification({
      recipient: req.university.user,
      title: 'Challenge assigned',
      message: `A new challenge has been assigned to your institution: "${challenge.title}".`,
      type: 'challenge_assigned',
      relatedChallenge: challenge._id,
    });

    res.status(200).json({ challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.recommendedUniversities = challenge.recommendedUniversities.filter(
      (r) => r.university.toString() !== req.university._id.toString()
    );
    await challenge.save();

    res.status(200).json({ message: 'Challenge declined', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard, acceptChallenge, rejectChallenge };