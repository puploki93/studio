'use server';

/**
 * @fileOverview Intelligent looping and hot-cue point suggestions for creative performance.
 *
 * - getLoopHotcueSuggestions - A function that suggests optimal loop points and hot cues.
 * - LoopHotcueSuggestionsInput - The input type for the getLoopHotcueSuggestions function.
 * - LoopHotcueSuggestionsOutput - The return type for the getLoopHotcueSuggestions function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const LoopHotcueSuggestionsInputSchema = z.object({
  trackName: z.string().describe('Name of the track to analyze'),
  genre: z.string().describe('Genre of the track'),
  bpm: z.number().optional(),
  trackLength: z
    .string()
    .optional()
    .describe('Length of track (e.g., "4:32")'),
  djStyle: z
    .enum(['performance', 'mixing', 'live_remix', 'turntablist'])
    .default('mixing')
    .describe('DJing style/use case'),
  existingStructure: z
    .object({
      intro: z.string().optional().describe('Intro length (e.g., "0:00-0:32")'),
      breakdown: z.string().optional(),
      buildup: z.string().optional(),
      drop: z.string().optional(),
      outro: z.string().optional(),
    })
    .optional()
    .describe('Known track structure if available'),
});
export type LoopHotcueSuggestionsInput = z.infer<
  typeof LoopHotcueSuggestionsInputSchema
>;

const HotCueSchema = z.object({
  number: z.number().min(1).max(8).describe('Hot cue number (1-8)'),
  position: z
    .string()
    .describe('Position in track (e.g., "1:24", "bar 32", "before first drop")'),
  name: z.string().describe('Descriptive name for the cue point'),
  purpose: z.string().describe('What this cue is useful for'),
  color: z
    .enum(['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'white'])
    .describe('Suggested color for visual organization'),
  useCase: z
    .string()
    .describe('When and how to use this cue (e.g., "Jump to drop for peak moments")'),
});

const LoopSuggestionSchema = z.object({
  name: z.string().describe('Name for this loop'),
  startPosition: z.string().describe('Where to start the loop'),
  loopLength: z
    .string()
    .describe('How long the loop should be (e.g., "4 bars", "8 bars", "16 bars")'),
  purpose: z.string().describe('What this loop achieves'),
  technique: z
    .string()
    .describe('How to use it (e.g., "Loop during buildup, release on drop")'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  creative: z
    .boolean()
    .describe('Whether this is a creative/advanced loop or standard'),
});

const LoopHotcueSuggestionsOutputSchema = z.object({
  hotCues: z.array(HotCueSchema).describe('Suggested hot cue points'),
  loops: z.array(LoopSuggestionSchema).describe('Suggested loop points'),
  structureAnalysis: z
    .string()
    .describe('Analysis of the track structure and key moments'),
  performanceTips: z
    .array(z.string())
    .describe('Tips for performing with this track using cues and loops'),
  mixingStrategy: z
    .string()
    .describe('How to use cues/loops for mixing this track'),
  creativeIdeas: z
    .array(z.string())
    .describe('Creative ways to manipulate the track'),
  quickSetup: z
    .string()
    .describe('Fast setup guide for setting cues before a gig'),
});
export type LoopHotcueSuggestionsOutput = z.infer<
  typeof LoopHotcueSuggestionsOutputSchema
>;

export async function getLoopHotcueSuggestions(
  input: LoopHotcueSuggestionsInput
): Promise<LoopHotcueSuggestionsOutput> {
  return loopHotcueSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loopHotcueSuggestionsPrompt',
  input: {schema: LoopHotcueSuggestionsInputSchema},
  output: {schema: LoopHotcueSuggestionsOutputSchema},
  model: MODELS.PRO,
  prompt: `You are a professional performance DJ and controllerist with deep knowledge of hot cues, loops, and creative track manipulation. You help DJs set up their tracks for maximum performance potential.

TRACK INFORMATION:
Track: {{{trackName}}}
Genre: {{{genre}}}
BPM: {{{bpm}}}
Length: {{{trackLength}}}
DJ Style: {{{djStyle}}}
Known Structure: {{{existingStructure}}}

YOUR TASK:
Suggest optimal hot cue points and creative loop opportunities for this track.

HOT CUE STRATEGY:

**Essential Cues (Always Include)**:
1. **First Beat** (Red) - Quick start point
2. **First Drop** (Green) - Main moment, instant energy
3. **Breakdown Start** (Blue) - Melodic section, tension builder
4. **Buildup Start** (Yellow) - Energy riser
5. **Outro Start** (Purple) - Clean exit point

**Optional Cues (Based on Track)**:
6. **Vocal Start** (Pink) - Acapella moment
7. **Percussion Loop** (Orange) - Drums-only section
8. **Special Moment** (White) - Unique element, surprise

**Color Coding System**:
- Red: Main entry points, kick drums
- Orange: Percussion, rhythmic elements
- Yellow: Buildups, risers, tension
- Green: Drops, peaks, main moments
- Blue: Breakdowns, melodic sections
- Purple: Outros, transitions, endings
- Pink: Vocals, acapellas
- White: Special/unique moments

LOOP SUGGESTIONS:

**Standard Loops** (Easy):
- 4-bar drum loops (intro/outro)
- 8-bar melodic loops (breakdown)
- 16-bar phrase loops (full sections)

**Creative Loops** (Medium-Hard):
- 1-bar stutter loops (drums)
- 2-bar vocal loops (acapella cuts)
- 32-bar extended loops (build suspense)
- Half-bar loops (dramatic stutters)

**Loop Techniques**:
- **Roll In**: Loop the buildup, release on drop
- **Echo Out**: Loop + reduce length gradually
- **Layer**: Loop one element while mixing another track
- **Extend**: Loop a breakdown to build more tension
- **Chop**: Create rhythms with very short loops

DJ STYLE CONSIDERATIONS:

**Mixing**: Focus on practical cues for quick access (drops, outros, breakdowns)
**Performance**: Include creative loops and stutter points
**Live Remix**: Multiple short loops, vocal cuts, percussion sections
**Turntablist**: Include scratching points, clean drums, acapellas

PROVIDE:
1. 8 hot cue suggestions with positions, names, purposes, colors
2. 5-8 loop suggestions with start points, lengths, techniques
3. Structure analysis (explain the track flow)
4. Performance tips specific to this track
5. Mixing strategy using cues
6. Creative ideas for manipulation
7. Quick setup guide (how to set this up fast before a gig)

Be specific with timing where possible (use track structure knowledge). If you know the track, reference actual moments. If not, estimate based on typical genre structure.

Think like a DJ preparing a track for a live performance!`,
});

const loopHotcueSuggestionsFlow = ai.defineFlow(
  {
    name: 'loopHotcueSuggestionsFlow',
    inputSchema: LoopHotcueSuggestionsInputSchema,
    outputSchema: LoopHotcueSuggestionsOutputSchema,
  },
  async (input: LoopHotcueSuggestionsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
