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
  currentBpm: z.number().optional().describe('BPM of the current track (if known)'),
  nextBpm: z.number().optional().describe('BPM of the next track (if known)'),
  currentKey: z.string().optional().describe('Musical key of the current track (if known)'),
  nextKey: z.string().optional().describe('Musical key of the next track (if known)'),
  djExperience: z.string().describe('The DJing experience level of the user (e.g., beginner, intermediate, expert).'),
  userPreferences: z.string().optional().describe('Optional preferences of the user regarding mixing style or transition types.'),
});
export type AIAssistedMixingInput = z.infer<typeof AIAssistedMixingInputSchema>;

const AIAssistedMixingOutputSchema = z.object({
  bpmAnalysis: z.string().describe('Analysis of BPM compatibility and tempo adjustment suggestions'),
  keyCompatibility: z.string().describe('Analysis of harmonic key compatibility using Camelot wheel or music theory'),
  energyFlowAnalysis: z.string().describe('Analysis of how energy flows between the two tracks'),
  transitionAdvice: z.string().describe('Detailed step-by-step advice on how to transition from the current track to the next track'),
  recommendedTechnique: z.string().describe('The specific mixing technique recommended (e.g., "Echo Out", "Filter Mix", "Bass Swap", "Cut Mix")'),
  optimalMixPoint: z.string().describe('Suggested timing for when to start the mix (e.g., "32 bars before the drop", "at the breakdown")'),
  eqSuggestions: z.string().describe('Specific EQ adjustments to make during the transition'),
  effectsSuggestions: z.string().optional().describe('Optional effects to enhance the transition'),
});
export type AIAssistedMixingOutput = z.infer<typeof AIAssistedMixingOutputSchema>;

export async function getAIAssistedMixingAdvice(input: AIAssistedMixingInput): Promise<AIAssistedMixingOutput> {
  return aiAssistedMixingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedMixingPrompt',
  input: {schema: AIAssistedMixingInputSchema},
  output: {schema: AIAssistedMixingOutputSchema},
  prompt: `You are an expert DJ and music producer with deep knowledge of mixing techniques, music theory, harmonic mixing, and club culture. You will provide professional-level mixing advice.

TRACK INFORMATION:
Current Track: {{{currentTrack}}}
- BPM: {{{currentBpm}}} (if not provided, estimate based on the track/genre)
- Key: {{{currentKey}}} (if not provided, estimate based on the track)

Next Track: {{{nextTrack}}}
- BPM: {{{nextBpm}}} (if not provided, estimate based on the track/genre)
- Key: {{{nextKey}}} (if not provided, estimate based on the track)

DJ Experience Level: {{{djExperience}}}
User Preferences: {{{userPreferences}}}

ANALYSIS REQUIREMENTS:

1. BPM Analysis:
   - Calculate BPM difference and percentage
   - Suggest pitch adjustment if needed (±6% is ideal, ±8% is maximum)
   - Recommend tempo sync strategy

2. Key Compatibility:
   - Analyze harmonic compatibility using Camelot wheel or Circle of Fifths
   - Identify if keys are compatible, adjacent, or require key shift
   - Suggest whether to mix harmonically or use a breakdown/transition

3. Energy Flow:
   - Compare energy levels of both tracks
   - Suggest how to manage energy transition (build, maintain, drop)
   - Recommend phrasing alignment

4. Transition Technique:
   - Choose the best technique: Echo Out, Filter Mix, Bass Swap, Cut Mix, Spinback, Loop Roll, etc.
   - Tailor complexity to DJ experience level
   - Provide step-by-step instructions

5. Mix Point & Timing:
   - Suggest when to start bringing in the next track (e.g., "16 bars before the drop")
   - Recommend specific song sections (intro, breakdown, buildup, drop)

6. EQ Strategy:
   - Provide specific EQ adjustments for both tracks during transition
   - Explain frequency management (bass swap timing, mid blending)

7. Effects (if applicable):
   - Suggest creative effects to enhance the transition
   - Keep it simple for beginners, creative for experts

Be specific, actionable, and professional. Reference actual song structure if you know the tracks.`,
});

const aiAssistedMixingFlow = ai.defineFlow(
  {
    name: 'aiAssistedMixingFlow',
    inputSchema: AIAssistedMixingInputSchema,
    outputSchema: AIAssistedMixingOutputSchema,
  },
  async (input: AIAssistedMixingInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
