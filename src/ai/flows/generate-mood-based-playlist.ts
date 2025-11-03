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

const TrackSchema = z.object({
  title: z.string().describe('The song title and artist (e.g., "Artist - Song Title")'),
  bpm: z.number().describe('Beats per minute (typical range 60-180)'),
  key: z.string().describe('Musical key (e.g., "Am", "C#", "Eb")'),
  energy: z.number().min(1).max(10).describe('Energy level from 1 (calm) to 10 (intense)'),
  genre: z.string().describe('Primary genre of the track'),
});

const GenerateMoodBasedPlaylistOutputSchema = z.object({
  playlistDescription: z
    .string()
    .describe(
      'A description of the generated playlist, including the overall vibe, genre blend, and flow.'
    ),
  songs: z
    .array(TrackSchema)
    .describe('A list of tracks with detailed metadata that fit the specified mood or context.'),
  energyCurve: z
    .string()
    .describe('Description of how energy flows through the playlist (e.g., "builds gradually", "peaks in middle")'),
  genreBlend: z
    .array(z.string())
    .describe('The genres blended in this playlist'),
  avgBpm: z.number().describe('Average BPM of the playlist'),
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
  prompt: `You are an expert DJ with deep knowledge of music theory, genres, and DJing techniques. You will generate a sophisticated playlist with detailed track metadata.

  Mood/Context: {{{mood}}}

  Create a 10-track playlist that:
  1. Blends complementary genres to match the mood
  2. Has a thoughtful energy curve (flow) throughout
  3. Considers BPM compatibility for smooth mixing
  4. Includes harmonic key information for key mixing
  5. Features real, popular songs that fit the context

  IMPORTANT:
  - Select tracks with BPMs that are mix-compatible (within ~10-20% of each other for smooth transitions)
  - Choose keys that are harmonically compatible (use Camelot wheel principles when possible)
  - Design an intentional energy curve (e.g., build up, plateau, wind down)
  - Be specific with artist names and track titles
  - Energy levels should flow naturally (avoid dramatic jumps unless the mood calls for it)

  Respond with a complete JSON object including: playlistDescription, songs array (with title, bpm, key, energy, genre for each), energyCurve, genreBlend, and avgBpm.`,
});

const generateMoodBasedPlaylistFlow = ai.defineFlow(
  {
    name: 'generateMoodBasedPlaylistFlow',
    inputSchema: GenerateMoodBasedPlaylistInputSchema,
    outputSchema: GenerateMoodBasedPlaylistOutputSchema,
  },
  async (input: GenerateMoodBasedPlaylistInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
