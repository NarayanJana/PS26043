// Deterministic priority scoring — the LLM extracts keywords,
// but the actual priority number comes from this formula instead
// of the model's own judgment (small models default to "High" too often).

const CRITICAL_KEYWORDS = [
  // Death / serious injury
  'death', 'deaths', 'died', 'dead', 'fatal', 'fatality',
  'kill', 'killed', 'life-threatening', 'life threatening',
  'injury', 'injured', 'serious injury', 'casualty', 'casualties',

  // Medical / public health emergencies
  'outbreak', 'epidemic', 'pandemic', 'disease', 'infection',
  'infectious', 'contagious', 'virus', 'bacterial',
  'malnutrition', 'starvation', 'poisoning', 'toxic',
  'contamination', 'contaminated', 'unsafe drinking water',

  // Major disasters
  'flood', 'flooding', 'flash flood', 'drought',
  'earthquake', 'landslide', 'cyclone', 'storm',
  'fire', 'wildfire', 'lightning',

  // Infrastructure / structural danger
  'collapse', 'collapsed', 'structural failure',
  'unsafe building', 'unsafe bridge', 'dam failure',
  'bridge failure', 'road collapse', 'building collapse',
  'crack', 'structural damage',

  // Electrical / physical hazards
  'electrocution', 'electric shock', 'exposed wires',
  'live wires', 'electrical hazard', 'gas leak',
  'chemical leak', 'hazardous', 'hazard',
  'dangerous', 'unsafe', 'risk to life',

  // Sanitation / water emergencies
  'sewage', 'sewage overflow', 'open sewer',
  'sewer overflow', 'fecal contamination',
  'water contamination', 'contaminated water',
  'toxic water',

  // Major accidents / transport
  'accident', 'major accident', 'collision',
  'train accident', 'bus accident', 'road accident',
  'drowning', 'missing person',

  // Urgent humanitarian situations
  'emergency', 'crisis', 'evacuation',
  'displacement', 'homeless', 'humanitarian crisis',
];

const MODERATE_KEYWORDS = [
  // Resource shortages
  'shortage',
  'scarcity',
  'lack of',
  'insufficient',
  'limited access',
  'unavailability',

  // Infrastructure problems
  'damaged',
  'broken',
  'deteriorated',
  'poor condition',
  'maintenance',
  'repair needed',
  'infrastructure issue',

  // Water & sanitation
  'water shortage',
  'water scarcity',
  'water supply',
  'irregular water supply',
  'leak',
  'leakage',
  'blocked drain',
  'drainage problem',
  'drainage',
  'wastewater',

  // Agriculture
  'crop loss',
  'crop damage',
  'irrigation problem',
  'irrigation shortage',
  'low yield',
  'soil degradation',
  'soil erosion',
  'pest infestation',

  // Environment
  'pollution',
  'air pollution',
  'water pollution',
  'noise pollution',
  'waste',
  'waste disposal',
  'garbage',
  'litter',
  'deforestation',
  'erosion',

  // Transport
  'traffic',
  'congestion',
  'delay',
  'poor roads',
  'road damage',
  'potholes',
  'transport shortage',
  'inadequate transport',

  // Education
  'lack of teachers',
  'teacher shortage',
  'school shortage',
  'poor facilities',
  'inadequate facilities',
  'lack of equipment',
  'limited resources',

  // Healthcare
  'long waiting time',
  'limited healthcare',
  'healthcare access',
  'lack of doctors',
  'doctor shortage',
  'medicine shortage',
  'inadequate facilities',

  // Public services
  'service disruption',
  'poor service',
  'limited service',
  'access problem',
  'accessibility',
  'inconvenience',
  'complaints',

  // General
  'crowding',
  'overcrowding',
  'noise',
  'disruption',
  'inefficient',
  'neglect',
  'poor management',
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
  if (score < 3.5) return 'Low';
  if (score < 6) return 'Medium';
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