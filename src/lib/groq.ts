import OpenAI from 'openai';

// Groq API client - compatible with OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export default groq;

// Available models
export const GROQ_MODELS = {
  chat: 'llama-3.3-70b-versatile', // Best for chat
  fast: 'llama-3.1-8b-instant',    // Fastest
  vision: 'llama-3.2-11b-vision-preview', // For images
};
