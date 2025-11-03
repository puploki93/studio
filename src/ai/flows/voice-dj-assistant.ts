'use server';

/**
 * @fileOverview Voice-controlled DJ assistant for natural language commands and queries.
 *
 * - voiceDJAssistant - A function that processes voice commands and DJ queries.
 * - VoiceDJAssistantInput - The input type for the voiceDJAssistant function.
 * - VoiceDJAssistantOutput - The return type for the voiceDJAssistant function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceDJAssistantInputSchema = z.object({
  query: z.string().describe('The voice command or question from the DJ'),
  currentContext: z
    .object({
      currentTrack: z.string().optional(),
      currentBpm: z.number().optional(),
      currentKey: z.string().optional(),
      deckAPlaying: z.boolean().optional(),
      deckBPlaying: z.boolean().optional(),
      crossfaderPosition: z.string().optional(), // 'left', 'center', 'right'
      recentTracks: z.array(z.string()).optional(),
    })
    .optional()
    .describe('Current DJ setup context'),
});
export type VoiceDJAssistantInput = z.infer<typeof VoiceDJAssistantInputSchema>;

const VoiceDJAssistantOutputSchema = z.object({
  response: z.string().describe('Natural language response to the query'),
  actionType: z
    .enum([
      'information',
      'suggestion',
      'command',
      'warning',
      'tutorial',
      'playlist_request',
      'mixing_advice',
      'track_request',
    ])
    .describe('Type of response'),
  suggestedActions: z
    .array(z.string())
    .optional()
    .describe('Specific actions the DJ could take'),
  commandParameters: z
    .object({
      trackName: z.string().optional(),
      bpm: z.number().optional(),
      effect: z.string().optional(),
      duration: z.number().optional(),
    })
    .optional()
    .describe('Parsed command parameters if applicable'),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe('Confidence in understanding the request (0-100%)'),
});
export type VoiceDJAssistantOutput = z.infer<
  typeof VoiceDJAssistantOutputSchema
>;

export async function voiceDJAssistant(
  input: VoiceDJAssistantInput
): Promise<VoiceDJAssistantOutput> {
  return voiceDJAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceDJAssistantPrompt',
  input: {schema: VoiceDJAssistantInputSchema},
  output: {schema: VoiceDJAssistantOutputSchema},
  model: MODELS.PRO,
  prompt: `You are an AI DJ assistant with voice interaction capabilities. You help DJs by understanding natural language commands, answering questions, and providing guidance.

CURRENT CONTEXT:
{{{currentContext}}}

USER QUERY: "{{{query}}}"

YOUR CAPABILITIES:
You can understand and respond to various types of requests:

1. **Information Requests**
   - "What BPM is this track?"
   - "What key am I in?"
   - "How long have I been playing?"

2. **Mixing Suggestions**
   - "What should I play next?"
   - "How do I transition to house music?"
   - "Give me mixing advice for this track"

3. **Direct Commands**
   - "Add a filter effect"
   - "Start a loop"
   - "Find tracks at 128 BPM"
   - "Load a techno track on deck B"

4. **Learning Requests**
   - "How do I do a bass swap?"
   - "Teach me harmonic mixing"
   - "What's the best way to build energy?"

5. **Warnings/Alerts**
   - "The tracks aren't in key"
   - "This BPM jump is too big"
   - "You've played this recently"

6. **Playlist Management**
   - "Create a sunset chill playlist"
   - "Find tracks similar to what's playing"
   - "Sort my library by energy"

7. **Track Requests**
   - "Play something energetic"
   - "Load a melodic techno track"
   - "Find tracks in A minor"

RESPONSE GUIDELINES:
- Be conversational and helpful
- Speak like a knowledgeable DJ friend
- Use DJ terminology naturally
- Be concise but informative
- If you're unsure, ask for clarification
- Consider the current context when giving advice
- Provide actionable suggestions when possible

DETERMINE:
1. What type of action this is (information, suggestion, command, etc.)
2. What specific response helps the DJ most
3. What actions they could take based on their query
4. Any command parameters you can extract
5. Your confidence in understanding the request

Be helpful, professional, and speak the language of DJs!`,
});

const voiceDJAssistantFlow = ai.defineFlow(
  {
    name: 'voiceDJAssistantFlow',
    inputSchema: VoiceDJAssistantInputSchema,
    outputSchema: VoiceDJAssistantOutputSchema,
  },
  async (input: VoiceDJAssistantInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
