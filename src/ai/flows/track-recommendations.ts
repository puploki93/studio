'use server';

/**
 * @fileOverview Intelligent track recommendations based on current context, DJ style, and crowd energy.
 *
 * - getTrackRecommendations - A function that generates smart track suggestions for DJs.
 * - TrackRecommendationsInput - The input type for the getTrackRecommendations function.
 * - TrackRecommendationsOutput - The return type for the getTrackRecommendations function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const TrackRecommendationsInputSchema = z.object({
  currentTrack: z.string().describe('The track currently playing'),
  currentBpm: z.number().optional().describe('BPM of the current track'),
  currentKey: z.string().optional().describe('Musical key of the current track'),
  currentGenre: z.string().optional().describe('Genre of the current track'),
  setContext: z
    .string()
    .describe(
      'Context of the DJ set (e.g., "opening set at underground techno club", "peak time house set", "sunset beach party")'
    ),
  crowdEnergy: z
    .enum(['low', 'building', 'peak', 'cooling_down'])
    .describe('Current crowd energy level'),
  djStyle: z
    .string()
    .optional()
    .describe('DJ style or preferences (e.g., "loves 90s jungle", "tech-house specialist")'),
  recentTracks: z
    .array(z.string())
    .optional()
    .describe('List of recently played tracks to avoid repetition'),
});
export type TrackRecommendationsInput = z.infer<
  typeof TrackRecommendationsInputSchema
>;

const RecommendedTrackSchema = z.object({
  title: z.string().describe('Artist - Track Title'),
  bpm: z.number().describe('BPM of the track'),
  key: z.string().describe('Musical key'),
  genre: z.string().describe('Genre'),
  reason: z
    .string()
    .describe('Why this track is recommended for this specific moment'),
  mixingNotes: z.string().describe('Quick tips for mixing this track in'),
  energyLevel: z.number().min(1).max(10).describe('Energy level (1-10)'),
  vibeMatch: z
    .number()
    .min(1)
    .max(10)
    .describe('How well it matches the current vibe (1-10)'),
});

const TrackRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(RecommendedTrackSchema)
    .describe('List of 5 recommended tracks'),
  strategyNotes: z
    .string()
    .describe('Overall strategy for where to take the set from here'),
  energyCurveAdvice: z
    .string()
    .describe('Advice on managing energy progression'),
});
export type TrackRecommendationsOutput = z.infer<
  typeof TrackRecommendationsOutputSchema
>;

export async function getTrackRecommendations(
  input: TrackRecommendationsInput
): Promise<TrackRecommendationsOutput> {
  return trackRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trackRecommendationsPrompt',
  input: {schema: TrackRecommendationsInputSchema},
  output: {schema: TrackRecommendationsOutputSchema},
  model: MODELS.PRO, // Use Pro model for better reasoning
  prompt: `You are an expert DJ with encyclopedic music knowledge and deep understanding of DJ set flow, crowd psychology, and music programming.

CURRENT SITUATION:
- Current Track: {{{currentTrack}}}
- BPM: {{{currentBpm}}}
- Key: {{{currentKey}}}
- Genre: {{{currentGenre}}}
- Set Context: {{{setContext}}}
- Crowd Energy: {{{crowdEnergy}}}
- DJ Style: {{{djStyle}}}
- Recent Tracks: {{{recentTracks}}}

YOUR TASK:
Recommend 5 tracks that would work perfectly for what to play next, considering:

1. **Harmonic Mixing**: Suggest tracks in compatible keys (use Camelot wheel principles)
2. **BPM Progression**: Tracks should have BPMs that allow smooth mixing (within 10-20% or strategically different for energy shifts)
3. **Energy Management**: Match or intentionally shift crowd energy based on the context
4. **Genre Coherence**: Maintain genre flow while allowing for tasteful surprises
5. **Timing & Context**: Consider where in the set you are (opening, building, peak, closing)
6. **Avoid Repetition**: Don't suggest tracks from recentTracks list
7. **DJ Style**: Align with the DJ's preferences and strengths

For each track provide:
- Full title (Artist - Track)
- Accurate BPM and key
- Genre
- Specific reason why it works NOW
- Quick mixing tips
- Energy level rating
- Vibe match score

Also provide:
- Strategic notes on where to take the set
- Energy curve advice for the next 20-30 minutes

Be specific with real tracks. Think like a professional DJ who reads the room and knows how to build a journey.`,
});

const trackRecommendationsFlow = ai.defineFlow(
  {
    name: 'trackRecommendationsFlow',
    inputSchema: TrackRecommendationsInputSchema,
    outputSchema: TrackRecommendationsOutputSchema,
  },
  async (input: TrackRecommendationsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
