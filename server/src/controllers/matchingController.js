const Challenge = require('../models/Challenge');
const { findMatchingUniversities } = require('../services/matching/universityMatcher');

const getUniversityRecommendations = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const recommendations = await findMatchingUniversities(challenge);
    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Persists the current recommendations onto the challenge document itself,
// so they show up in the "Recommended universities" panel on the details
// page without recomputing every time. Call this after AI analysis
// completes, or manually via this endpoint.
const refreshRecommendations = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const recommendations = await findMatchingUniversities(challenge);

    challenge.recommendedUniversities = recommendations.map((r) => ({
      university: r.university,
      matchScore: r.matchScore,
      matchedExpertise: r.matchedExpertise,
    }));

    await challenge.save();
    res.status(200).json({ challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUniversityRecommendations, refreshRecommendations };