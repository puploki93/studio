import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash', // Default model for fast responses
});

// Export model names for easy reference
export const MODELS = {
  FLASH: 'googleai/gemini-2.5-flash', // Fast, general purpose
  PRO: 'googleai/gemini-2.0-pro', // More capable, better reasoning
  VISION: 'googleai/gemini-2.0-flash-exp', // Multimodal (vision + text)
} as const;
