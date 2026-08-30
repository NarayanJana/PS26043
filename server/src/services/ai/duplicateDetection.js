const Challenge = require('../../models/Challenge');

// Tunable thresholds — raise MIN_DISPLAY_SCORE to surface fewer, more
// confident matches; raise DUPLICATE_SCORE to be stricter about what
// counts as a likely duplicate rather than just "related."
const MIN_DISPLAY_SCORE = 25;
const DUPLICATE_SCORE = 65;
const MAX_CANDIDATES = 15;
const MAX_RESULTS = 5;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'up', 'about', 'into', 'over', 'after', 'this', 'that', 'these',
  'those', 'it', 'its', 'as', 'has', 'have', 'had', 'do', 'does', 'did',
  'not', 'no', 'we', 'they', 'their', 'our', 'there', 'here', 'due',
]);

// Lowercases, strips punctuation, and returns a Set of meaningful words.
// This is the piece to replace if you later swap in real embeddings —
// everything else (candidate fetching, scoring, storage) stays the same.
const tokenize = (text) => {
  const words = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
};

// Jaccard similarity: size of the word overlap divided by the size of
// the combined vocabulary. Returns a percentage 0-100.
const jaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection += 1;
  }
  const unionSize = setA.size + setB.size - intersection;
  return Math.round((intersection / unionSize) * 100);
};

const findSimilarChallenges = async (challenge) => {
  const searchText = `${challenge.title} ${challenge.description}`;

  // Use MongoDB's text index to cheaply narrow down candidates before
  // doing any real comparison work — this is the part that would become
  // a $vectorSearch aggregation stage if you enable MongoDB Atlas Vector
  // Search later. The scoring logic below wouldn't need to change.
  const candidates = await Challenge.find(
    {
      _id: { $ne: challenge._id },
      $text: { $search: searchText },
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(MAX_CANDIDATES)
    .select('title description');

  if (candidates.length === 0) return [];

  const targetTokens = tokenize(searchText);

  const scored = candidates
    .map((c) => {
      const candidateTokens = tokenize(`${c.title} ${c.description}`);
      const similarity = jaccardSimilarity(targetTokens, candidateTokens);
      return { challenge: c._id, similarity };
    })
    .filter((c) => c.similarity >= MIN_DISPLAY_SCORE)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MAX_RESULTS);

  return scored;
};

module.exports = { findSimilarChallenges, DUPLICATE_SCORE };