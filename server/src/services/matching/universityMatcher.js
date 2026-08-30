const University = require('../../models/University');

// Normalizes strings for comparison: lowercase, trimmed, punctuation-stripped.
const normalize = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

// Pulls every expertise-bearing string out of a university document into
// one flat array, tagged with where it came from (used for the "why it
// matched" breakdown shown on the frontend).
const collectUniversityExpertise = (university) => {
  const items = [];

  (university.facultyExpertise || []).forEach((e) =>
    items.push({ label: e, source: 'Faculty expertise' })
  );
  (university.researchAreas || []).forEach((e) =>
    items.push({ label: e, source: 'Research area' })
  );
  (university.labs || []).forEach((e) => items.push({ label: e, source: 'Lab' }));
  (university.innovationCenters || []).forEach((e) =>
    items.push({ label: e, source: 'Innovation center' })
  );
  (university.incubationFacilities || []).forEach((e) =>
    items.push({ label: e, source: 'Incubation facility' })
  );
  (university.departments || []).forEach((dept) => {
    (dept.expertiseAreas || []).forEach((e) =>
      items.push({ label: e, source: `${dept.name} department` })
    );
  });

  return items;
};

// Required expertise terms are matched against university expertise terms
// using substring containment in both directions (normalized), so e.g.
// "IoT" matches "IoT Systems" and "Water Management" matches "Water
// Resource Management" without needing exact string equality.
const scoreUniversityAgainstChallenge = (university, requiredExpertise) => {
  const universityItems = collectUniversityExpertise(university);
  const matched = [];

  requiredExpertise.forEach((req) => {
    const reqNorm = normalize(req);
    const hit = universityItems.find((item) => {
      const itemNorm = normalize(item.label);
      return itemNorm.includes(reqNorm) || reqNorm.includes(itemNorm);
    });
    if (hit) {
      matched.push({ requiredExpertise: req, matchedAgainst: hit.label, source: hit.source });
    }
  });

  const matchScore =
    requiredExpertise.length === 0
      ? 0
      : Math.round((matched.length / requiredExpertise.length) * 100);

  return { matchScore, matched };
};

const getRequiredExpertiseForChallenge = (challenge) => {
  // Prefer AI-extracted expertise when available; fall back to the
  // citizen's self-reported domain/sub-category so matching still works
  // even before AI analysis has completed.
  if (challenge.aiAnalysis?.requiredExpertise?.length > 0) {
    return challenge.aiAnalysis.requiredExpertise;
  }
  return [challenge.domain, challenge.subCategory].filter(Boolean);
};

const findMatchingUniversities = async (challenge, limit = 5) => {
  const requiredExpertise = getRequiredExpertiseForChallenge(challenge);
  if (requiredExpertise.length === 0) return [];

  const universities = await University.find();

  const scored = universities
    .map((university) => {
      const { matchScore, matched } = scoreUniversityAgainstChallenge(
        university,
        requiredExpertise
      );
      return {
        university: university._id,
        universityName: university.name,
        matchScore,
        matchedExpertise: matched.map((m) => m.matchedAgainst),
        matchDetails: matched,
      };
    })
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return scored;
};

module.exports = { findMatchingUniversities, getRequiredExpertiseForChallenge };