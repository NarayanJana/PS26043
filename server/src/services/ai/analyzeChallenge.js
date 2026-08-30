const groq = require('./groqClient');

const ANALYSIS_SYSTEM_PROMPT = `You are an analysis engine for a civic-tech platform that routes citizen-reported problems to university researchers and industry partners.

Given a challenge report, return ONLY a JSON object with this exact shape and nothing else — no markdown fences, no preamble, no explanation:

{
  "category": string (one of: Agriculture, Water & Sanitation, Healthcare, Education, Transport & Mobility, Energy, Environment & Waste, Public Safety, Other),
  "subCategory": string (a short, specific sub-area within the category),
  "summary": string (one or two sentences, plain language, summarizing the core problem),
  "priority": "High" | "Medium" | "Low",
  "keywords": string[] (3 to 8 short lowercase keywords),
  "requiredExpertise": string[] (2 to 6 academic/technical fields best suited to solve this, e.g. "Agricultural Engineering", "IoT", "Water Management")
}

Priority guidance: High = safety-critical, large numbers of people affected, or urgent/irreversible harm. Medium = significant but not urgent. Low = minor, localized, or already partially mitigated.`;

const buildUserPrompt = (challenge) => `
Title: ${challenge.title}

Description: ${challenge.description}

Domain (as self-reported by citizen): ${challenge.domain || 'Not specified'}
Sub-category (as self-reported): ${challenge.subCategory || 'Not specified'}
District: ${challenge.district}
Location: ${challenge.location || 'Not specified'}
People affected (estimated): ${challenge.peopleAffected || 'Not specified'}
Expected solution (citizen's own idea, if any): ${challenge.expectedSolution || 'None provided'}
Additional information: ${challenge.additionalInfo || 'None provided'}
`.trim();

const analyzeChallengeText = async (challenge) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(challenge) },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Model returned no content');
  }

  const parsed = JSON.parse(text);

  if (!parsed.category || !parsed.priority || !Array.isArray(parsed.keywords)) {
    throw new Error('Model response was missing required fields');
  }

  return parsed;
};

module.exports = { analyzeChallengeText };