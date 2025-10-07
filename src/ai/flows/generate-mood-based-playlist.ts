'use server';

/**
 * @fileOverview A playlist generator AI agent that generates playlists based on mood or context.
 *
 * - generateMoodBasedPlaylist - A function that handles the playlist generation process.
 * - GenerateMoodBasedPlaylistInput - The input type for the generateMoodBasedPlaylist function.
 * - GenerateMoodBasedPlaylistOutput - The return type for the generateMoodBasedPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodBasedPlaylistInputSchema = z.object({
  mood: z
    .string()
    .describe('The mood or context for which the playlist should be generated.'),
});
export type GenerateMoodBasedPlaylistInput = z.infer<
  typeof GenerateMoodBasedPlaylistInputSchema
>;

const GenerateMoodBasedPlaylistOutputSchema = z.object({
  playlistDescription: z
    .string()
    .describe(
      'A description of the generated playlist, including the overall vibe and some example songs.'
    ),
  songs: z
    .array(z.string())
    .describe('A list of song titles that fit the specified mood or context.'),
});
export type GenerateMoodBasedPlaylistOutput = z.infer<
  typeof GenerateMoodBasedPlaylistOutputSchema
>;

export async function generateMoodBasedPlaylist(
  input: GenerateMoodBasedPlaylistInput
): Promise<GenerateMoodBasedPlaylistOutput> {
  return generateMoodBasedPlaylistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoodBasedPlaylistPrompt',
  input: {schema: GenerateMoodBasedPlaylistInputSchema},
  output: {schema: GenerateMoodBasedPlaylistOutputSchema},
  prompt: `You are a DJ that knows many songs. You will generate a playlist with songs that fit the mood or context.

  Mood/Context: {{{mood}}}

  Respond with a JSON object with a playlistDescription and songs field. The playlistDescription should be a description of the playlist as a whole including the vibe and maybe a few example songs. The songs field should be a list of songs that fit the mood or context, where each item in the list is just the song name. Return 10 songs.`,
});

const generateMoodBasedPlaylistFlow = ai.defineFlow(
  {
    name: 'generateMoodBasedPlaylistFlow',
    inputSchema: GenerateMoodBasedPlaylistInputSchema,
    outputSchema: GenerateMoodBasedPlaylistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
