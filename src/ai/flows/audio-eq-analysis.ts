'use server';

/**
 * @fileOverview Audio analysis and EQ suggestions for optimal sound mixing.
 *
 * - getEQSuggestions - A function that analyzes track characteristics and suggests EQ settings.
 * - EQSuggestionsInput - The input type for the getEQSuggestions function.
 * - EQSuggestionsOutput - The return type for the getEQSuggestions function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const EQSuggestionsInputSchema = z.object({
  trackName: z.string().describe('The track to analyze'),
  genre: z.string().describe('Genre of the track'),
  mixingContext: z
    .string()
    .describe(
      'Where/how the track is being played (e.g., "club sound system", "home studio", "festival main stage")'
    ),
  currentIssues: z
    .string()
    .optional()
    .describe(
      'Any current sound issues (e.g., "muddy bass", "harsh highs", "vocals buried")'
    ),
  otherTrackInMix: z
    .string()
    .optional()
    .describe('The other track being mixed with (if applicable)'),
  desiredOutcome: z
    .string()
    .optional()
    .describe(
      'What sound you want to achieve (e.g., "warm and punchy", "bright and energetic")'
    ),
});
export type EQSuggestionsInput = z.infer<typeof EQSuggestionsInputSchema>;

const FrequencyBandSchema = z.object({
  frequency: z.string().describe('Frequency range (e.g., "60-80 Hz", "2-4 kHz")'),
  adjustment: z.string().describe('What to do (e.g., "boost +3dB", "cut -2dB", "no change")'),
  reason: z.string().describe('Why this adjustment helps'),
});

const EQSuggestionsOutputSchema = z.object({
  overallStrategy: z
    .string()
    .describe('Overall EQ strategy and philosophy for this track'),
  frequencyAdjustments: z
    .array(FrequencyBandSchema)
    .describe('Specific frequency band adjustments'),
  lowEnd: z
    .object({
      subBass: z.string().describe('Sub-bass advice (20-60 Hz)'),
      bass: z.string().describe('Bass advice (60-250 Hz)'),
    })
    .describe('Low frequency recommendations'),
  midRange: z
    .object({
      lowMids: z.string().describe('Low-mids advice (250-500 Hz)'),
      mids: z.string().describe('Mids advice (500 Hz-2 kHz)'),
      highMids: z.string().describe('High-mids advice (2-4 kHz)'),
    })
    .describe('Mid-range recommendations'),
  highEnd: z
    .object({
      presence: z.string().describe('Presence advice (4-6 kHz)'),
      brilliance: z.string().describe('Brilliance/air advice (6-20 kHz)'),
    })
    .describe('High frequency recommendations'),
  mixingTips: z
    .string()
    .describe('Tips for how to EQ when mixing with another track'),
  compressionAdvice: z
    .string()
    .optional()
    .describe('Optional compression suggestions to complement EQ'),
  genreSpecificNotes: z
    .string()
    .describe('Genre-specific EQ considerations'),
});
export type EQSuggestionsOutput = z.infer<typeof EQSuggestionsOutputSchema>;

export async function getEQSuggestions(
  input: EQSuggestionsInput
): Promise<EQSuggestionsOutput> {
  return eqSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eqSuggestionsPrompt',
  input: {schema: EQSuggestionsInputSchema},
  output: {schema: EQSuggestionsOutputSchema},
  model: MODELS.PRO, // Use Pro model for detailed technical analysis
  prompt: `You are a professional audio engineer and DJ with deep expertise in mixing, EQ techniques, frequency management, and sound system optimization.

TRACK DETAILS:
- Track: {{{trackName}}}
- Genre: {{{genre}}}
- Mixing Context: {{{mixingContext}}}
- Current Issues: {{{currentIssues}}}
- Mixing With: {{{otherTrackInMix}}}
- Desired Outcome: {{{desiredOutcome}}}

YOUR TASK:
Provide expert EQ advice that helps achieve optimal sound quality for this specific track in this context.

ANALYSIS FRAMEWORK:

1. **Overall Strategy**:
   - What's the EQ philosophy for this genre and context?
   - What are the key elements to preserve/enhance?

2. **Frequency-by-Frequency Breakdown**:
   - Sub-bass (20-60 Hz): Club power, foundation
   - Bass (60-250 Hz): Warmth, body, kick drums
   - Low-mids (250-500 Hz): Can get muddy, careful management
   - Mids (500 Hz-2 kHz): Vocals, melodic elements
   - High-mids (2-4 kHz): Presence, clarity, definition
   - Presence (4-6 kHz): Brightness, attack
   - Brilliance (6-20 kHz): Air, sparkle, cymbals

3. **Context-Specific Considerations**:
   - Club systems: Usually bass-heavy, might need high-mid boost
   - Festival: Outdoor, need extra presence and clarity
   - Home studio: Balanced, careful with bass
   - Headphones: Different frequency response

4. **Genre-Specific Knowledge**:
   - Techno: Powerful low end, tight mids
   - House: Warm bass, prominent vocals
   - Drum & Bass: Sub-bass focus, crispy highs
   - Hip-hop: Deep bass, vocal clarity
   - etc.

5. **Mixing Considerations**:
   - How to EQ when blending with another track
   - Bass swapping techniques
   - Frequency masking avoidance

Be specific with:
- Exact frequency ranges
- dB adjustments (realistic: usually ±2-4 dB, rarely more than ±6 dB)
- Whether to use shelf, bell, or high/low pass filters
- Q values when relevant (narrow vs wide)

Provide actionable, professional advice that a DJ can immediately apply.`,
});

const eqSuggestionsFlow = ai.defineFlow(
  {
    name: 'eqSuggestionsFlow',
    inputSchema: EQSuggestionsInputSchema,
    outputSchema: EQSuggestionsOutputSchema,
  },
  async (input: EQSuggestionsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
