const Challenge = require('../models/Challenge');
const { findSimilarChallenges } = require('../services/ai/duplicateDetection');

const getSimilarChallenges = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const similar = await findSimilarChallenges(challenge);

    const populated = await Challenge.populate(similar, {
      path: 'challenge',
      select: 'title district status domain',
    });

    res.status(200).json({ similar: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSimilarChallenges };