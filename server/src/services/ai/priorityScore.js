// Deterministic priority scoring — the LLM extracts keywords,
// but the actual priority number comes from this formula instead
// of the model's own judgment (small models default to "High" too often).

const CRITICAL_KEYWORDS = [
  'death', 'died', 'fatal', 'outbreak', 'disease', 'epidemic', 'contamination',
  'contaminated', 'collapse', 'fire', 'flood', 'toxic', 'hazard', 'emergency',
  'unsafe', 'injury', 'injured', 'accident', 'drowning', 'electrocution',
  'poisoning', 'sanitation', 'sewage',
];

const MODERATE_KEYWORDS = [
  'delay', 'shortage', 'damaged', 'broken', 'pollution', 'waste', 'traffic',
  'congestion', 'noise', 'crowding', 'leak', 'blocked', 'erosion', 'drought',
];

// 0–6 points based on scale of people affected (log-ish buckets,
// since 50 vs 50,000 shouldn't be treated linearly)
const peopleAffectedScore = (peopleAffected) => {
  const n = Number(peopleAffected) || 0;
  if (n <= 0) return 0;
  if (n < 10) return 0.5;
  if (n < 50) return 1.5;
  if (n < 200) return 2.5;
  if (n < 1000) return 3.5;
  if (n < 5000) return 4.5;
  if (n < 20000) return 5.5;
  return 6;
};

// 0–4 points based on how many severity-signal keywords appear
const keywordScore = (keywords = [], text = '') => {
  const haystack = [...keywords, text].join(' ').toLowerCase();

  let criticalHits = 0;
  let moderateHits = 0;

  CRITICAL_KEYWORDS.forEach((word) => {
    if (haystack.includes(word)) criticalHits += 1;
  });
  MODERATE_KEYWORDS.forEach((word) => {
    if (haystack.includes(word)) moderateHits += 1;
  });

  const score = criticalHits * 1.5 + moderateHits * 0.5;
  return Math.min(score, 4);
};

const scoreToPriority = (score) => {
  if (score < 5) return 'Low';
  if (score < 7) return 'Medium';
  return 'High';
};

const calculatePriority = (challenge, keywords) => {
  const text = `${challenge.title} ${challenge.description}`;
  const pScore = peopleAffectedScore(challenge.peopleAffected);
  const kScore = keywordScore(keywords, text);
  const total = Math.min(pScore + kScore, 10);

  return {
    score: Math.round(total * 10) / 10,
    priority: scoreToPriority(total),
  };
};

module.exports = { calculatePriority };