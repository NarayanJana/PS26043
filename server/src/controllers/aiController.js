const Challenge = require('../models/Challenge');
const { runAnalysisForChallenge } = require('../services/ai/runAnalysis');

const triggerAnalysis = async (req, res) => {
  try {
    const challenge = await runAnalysisForChallenge(req.params.id);
    res.status(200).json({ challenge });
  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);
    res.status(500).json({
      message: `AI analysis failed: ${error.message}`,
    });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).select('aiAnalysis');
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.status(200).json({ aiAnalysis: challenge.aiAnalysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { triggerAnalysis, getAnalysis };