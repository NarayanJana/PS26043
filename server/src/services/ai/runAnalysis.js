const Challenge = require('../../models/Challenge');
const { analyzeChallengeText } = require('./analyzeChallenge');
const { findSimilarChallenges } = require('./duplicateDetection');
const { findMatchingUniversities } = require('../matching/universityMatcher');

const runAnalysisForChallenge = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }

  if (challenge.status === 'submitted') {
    challenge.status = 'ai_analysis';
    await challenge.save();
  }

  let analysisError = null;

  try {
    const result = await analyzeChallengeText(challenge);
    console.log(`AI analysis result for ${challengeId}:`, JSON.stringify(result, null, 2));

    challenge.aiAnalysis = {
      category: result.category,
      subCategory: result.subCategory,
      summary: result.summary,
      priority: result.priority,
      keywords: result.keywords,
      requiredExpertise: result.requiredExpertise,
      analyzedAt: new Date(),
    };
    challenge.priority = result.priority;

    await challenge.save();
  } catch (error) {
    console.error(`AI analysis failed for challenge ${challengeId}:`, error.message);
    analysisError = error;
  }

  try {
    const similar = await findSimilarChallenges(challenge);
    challenge.similarChallenges = similar;
    await challenge.save();
  } catch (error) {
    console.error(`Duplicate detection failed for challenge ${challengeId}:`, error.message);
  }

  // University matching runs independently too — it falls back to the
  // citizen's self-reported domain when AI analysis hasn't succeeded,
  // so a broken LLM call shouldn't block this from working.
  try {
    const recommendations = await findMatchingUniversities(challenge);
    challenge.recommendedUniversities = recommendations.map((r) => ({
      university: r.university,
      matchScore: r.matchScore,
      matchedExpertise: r.matchedExpertise,
    }));
    await challenge.save();
  } catch (error) {
    console.error(`University matching failed for challenge ${challengeId}:`, error.message);
  }

  if (analysisError) {
    throw analysisError;
  }

  return challenge;
};

module.exports = { runAnalysisForChallenge };