'use server';

/**
 * @fileOverview AI-assisted mixing flow for providing intelligent transition advice and suggesting optimal drop points.
 *
 * - getAIAssistedMixingAdvice - A function that generates AI-assisted mixing advice.
 * - AIAssistedMixingInput - The input type for the getAIAssistedMixingAdvice function.
 * - AIAssistedMixingOutput - The return type for the getAIAssistedMixingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAssistedMixingInputSchema = z.object({
  currentTrack: z.string().describe('The name of the currently playing track.'),
  nextTrack: z.string().describe('The name of the track to be mixed in next.'),
  djExperience: z.string().describe('The DJing experience level of the user (e.g., beginner, intermediate, expert).'),
  userPreferences: z.string().optional().describe('Optional preferences of the user regarding mixing style or transition types.'),
});
export type AIAssistedMixingInput = z.infer<typeof AIAssistedMixingInputSchema>;

const AIAssistedMixingOutputSchema = z.object({
  transitionAdvice: z.string().describe('AI-generated advice on how to transition from the current track to the next track.'),
  optimalDropPoints: z.string().describe('Suggested optimal drop points in the next track for a smooth transition.'),
});
export type AIAssistedMixingOutput = z.infer<typeof AIAssistedMixingOutputSchema>;

export async function getAIAssistedMixingAdvice(input: AIAssistedMixingInput): Promise<AIAssistedMixingOutput> {
  return aiAssistedMixingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedMixingPrompt',
  input: {schema: AIAssistedMixingInputSchema},
  output: {schema: AIAssistedMixingOutputSchema},
  prompt: `You are an AI DJ assistant providing mixing advice to users of varying experience levels.

You will analyze the current track and the next track to provide intelligent transition advice and suggest optimal drop points.

Current Track: {{{currentTrack}}}
Next Track: {{{nextTrack}}}
DJ Experience Level: {{{djExperience}}}
User Preferences: {{{userPreferences}}}

Provide detailed transition advice, including specific techniques and tips, tailored to the user's experience level.
Suggest optimal drop points in the next track to create a professional-sounding mix.
Consider the user's preferences when generating the advice.

Transition Advice: 
Optimal Drop Points: `,
});

const aiAssistedMixingFlow = ai.defineFlow(
  {
    name: 'aiAssistedMixingFlow',
    inputSchema: AIAssistedMixingInputSchema,
    outputSchema: AIAssistedMixingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
