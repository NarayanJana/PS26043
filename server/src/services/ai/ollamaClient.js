const OpenAI = require('openai');

const ollama = new OpenAI({
  apiKey: 'ollama', // required by the SDK, ignored by Ollama
  baseURL: 'http://localhost:11434/v1',
});

module.exports = ollama;