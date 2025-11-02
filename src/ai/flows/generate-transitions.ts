'use server';

/**
 * @fileOverview AI-generated transitions and effects for creative mixing.
 *
 * - generateTransition - A function that creates custom transition sequences.
 * - GenerateTransitionInput - The input type for the generateTransition function.
 * - GenerateTransitionOutput - The return type for the generateTransition function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTransitionInputSchema = z.object({
  fromTrack: z.string().describe('The track transitioning out'),
  toTrack: z.string().describe('The track transitioning in'),
  fromBpm: z.number().optional(),
  toBpm: z.number().optional(),
  fromKey: z.string().optional(),
  toKey: z.string().optional(),
  transitionStyle: z
    .enum(['smooth', 'energetic', 'dramatic', 'creative', 'minimal'])
    .describe('Desired style of transition'),
  transitionLength: z
    .enum(['quick', 'medium', 'long', 'extended'])
    .describe('How long the transition should be'),
  availableEffects: z
    .array(z.string())
    .optional()
    .describe('Available effects (e.g., ["reverb", "delay", "filter", "flanger"])'),
});
export type GenerateTransitionInput = z.infer<
  typeof GenerateTransitionInputSchema
>;

const TransitionStepSchema = z.object({
  timepoint: z
    .string()
    .describe('When to execute this step (e.g., "0:00", "0:16", "1 bar before drop")'),
  action: z
    .string()
    .describe('What to do (e.g., "Start bringing in Track B at 50% volume")'),
  deck: z.enum(['A', 'B', 'both']).describe('Which deck(s) to apply this to'),
  parameters: z
    .object({
      volume: z.number().optional().describe('Volume level (0-100)'),
      eq: z
        .object({
          low: z.number().optional(),
          mid: z.number().optional(),
          high: z.number().optional(),
        })
        .optional(),
      effect: z.string().optional(),
      effectAmount: z.number().optional(),
      crossfader: z
        .number()
        .optional()
        .describe('Crossfader position (0=left, 50=center, 100=right)'),
      filter: z.number().optional().describe('Filter position (0-100)'),
    })
    .describe('Specific parameter values'),
});

const GenerateTransitionOutputSchema = z.object({
  transitionName: z
    .string()
    .describe('Creative name for this transition (e.g., "Echo Out to Filter Drop")'),
  description: z
    .string()
    .describe('Overview of what this transition achieves'),
  totalDuration: z.string().describe('Total length of transition (e.g., "32 bars", "1:30")'),
  steps: z
    .array(TransitionStepSchema)
    .describe('Step-by-step timeline of actions'),
  keyMoments: z
    .array(z.string())
    .describe('Critical moments to pay attention to'),
  tips: z.array(z.string()).describe('Pro tips for executing this transition'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .describe('Skill level required'),
  visualCue: z
    .string()
    .optional()
    .describe('What to watch for visually (waveforms, etc.)'),
});
export type GenerateTransitionOutput = z.infer<
  typeof GenerateTransitionOutputSchema
>;

export async function generateTransition(
  input: GenerateTransitionInput
): Promise<GenerateTransitionOutput> {
  return generateTransitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTransitionPrompt',
  input: {schema: GenerateTransitionInputSchema},
  output: {schema: GenerateTransitionOutputSchema},
  model: MODELS.PRO,
  prompt: `You are a creative DJ and producer who designs innovative, professional transitions between tracks. You understand mixing techniques, effects chains, and how to create memorable moments on the dancefloor.

TRANSITION REQUEST:
From: {{{fromTrack}}} (BPM: {{{fromBpm}}}, Key: {{{fromKey}}})
To: {{{toTrack}}} (BPM: {{{toBpm}}}, Key: {{{toKey}}})
Style: {{{transitionStyle}}}
Length: {{{transitionLength}}}
Available Effects: {{{availableEffects}}}

YOUR TASK:
Design a complete, step-by-step transition that a DJ can follow in real-time.

TRANSITION STYLES:

**Smooth**: Seamless blends, gentle EQ work, long overlaps
- Use gradual volume changes
- Subtle effect application
- Bass swaps at natural breakdowns
- Maintain energy consistency

**Energetic**: Quick cuts, dynamic effects, build anticipation
- Sharp transitions
- High energy effects (loop rolls, risers)
- Quick bass swaps
- Build tension and release

**Dramatic**: Big impact moments, creative effects, surprise elements
- Sudden cuts or drops
- Heavy effect usage (echo out, reverb throws)
- Unexpected timing
- Create "wow" moments

**Creative**: Experimental, genre-blending, innovative techniques
- Unconventional effect combinations
- Harmonic layering
- Acapella mixing
- Unique mashup moments

**Minimal**: Clean, precise, technical
- Few but precise adjustments
- Focus on perfect timing
- Minimal effects
- Let the tracks speak

TRANSITION LENGTHS:
- Quick: 8-16 bars
- Medium: 16-32 bars
- Long: 32-64 bars
- Extended: 64+ bars (full breakdown blend)

CREATE A TIMELINE:
Break down the transition into specific time points with exact actions:
- When to start the incoming track
- EQ adjustments (bass swap, mid blending, high filtering)
- Volume/crossfader movements
- Effect applications and removals
- Critical listening moments

INCLUDE:
1. A creative name for the transition
2. Total duration
3. Step-by-step timeline with timestamps
4. Which deck to apply each action to
5. Specific parameter values (volume, EQ levels, effect amounts)
6. Key moments to pay attention to
7. Pro tips for perfect execution
8. Difficulty rating
9. Visual cues (what to watch in waveforms)

Be specific with timing (use bars/beats or actual time), realistic with parameter values, and practical with execution. Think like you're coaching someone through the mix live.`,
});

const generateTransitionFlow = ai.defineFlow(
  {
    name: 'generateTransitionFlow',
    inputSchema: GenerateTransitionInputSchema,
    outputSchema: GenerateTransitionOutputSchema,
  },
  async (input: GenerateTransitionInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
