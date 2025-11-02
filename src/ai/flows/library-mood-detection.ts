'use server';

/**
 * @fileOverview Mood detection and intelligent categorization of music libraries.
 *
 * - detectLibraryMood - A function that analyzes music libraries and categorizes by mood/energy.
 * - LibraryMoodDetectionInput - The input type for the detectLibraryMood function.
 * - LibraryMoodDetectionOutput - The return type for the detectLibraryMood function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const TrackInfoSchema = z.object({
  title: z.string(),
  artist: z.string().optional(),
  genre: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
});

const LibraryMoodDetectionInputSchema = z.object({
  tracks: z.array(TrackInfoSchema).describe('List of tracks to analyze'),
  analysisDepth: z
    .enum(['quick', 'standard', 'detailed'])
    .default('standard')
    .describe('How detailed the analysis should be'),
  customCategories: z
    .array(z.string())
    .optional()
    .describe('Custom mood/vibe categories to use (e.g., ["dark", "uplifting", "groovy"])'),
});
export type LibraryMoodDetectionInput = z.infer<
  typeof LibraryMoodDetectionInputSchema
>;

const MoodCategorySchema = z.object({
  name: z.string().describe('Name of the mood category'),
  description: z.string().describe('What defines this mood'),
  energyLevel: z.number().min(1).max(10).describe('Average energy (1-10)'),
  trackCount: z.number().describe('Number of tracks in this category'),
  tracks: z.array(z.string()).describe('Track titles in this category'),
  bpmRange: z
    .object({
      min: z.number(),
      max: z.number(),
      average: z.number(),
    })
    .optional(),
  dominantKeys: z.array(z.string()).optional().describe('Most common keys'),
  playlistSuggestions: z
    .array(z.string())
    .describe('Suggested use cases for this mood'),
});

const LibraryMoodDetectionOutputSchema = z.object({
  overview: z
    .string()
    .describe('Overall description of the music library vibe and diversity'),
  moodCategories: z
    .array(MoodCategorySchema)
    .describe('Detected mood categories with tracks'),
  energyDistribution: z
    .object({
      low: z.number().describe('% of tracks with low energy (1-3)'),
      medium: z.number().describe('% of tracks with medium energy (4-7)'),
      high: z.number().describe('% of tracks with high energy (8-10)'),
    })
    .describe('Energy distribution across library'),
  genreDiversity: z
    .array(
      z.object({
        genre: z.string(),
        percentage: z.number(),
      })
    )
    .describe('Genre breakdown'),
  suggestedPlaylists: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        trackCount: z.number(),
        tracks: z.array(z.string()),
        useCase: z.string(),
      })
    )
    .describe('Auto-generated playlist suggestions'),
  insights: z
    .array(z.string())
    .describe('Interesting insights about the library (gaps, strengths, etc.)'),
});
export type LibraryMoodDetectionOutput = z.infer<
  typeof LibraryMoodDetectionOutputSchema
>;

export async function detectLibraryMood(
  input: LibraryMoodDetectionInput
): Promise<LibraryMoodDetectionOutput> {
  return libraryMoodDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'libraryMoodDetectionPrompt',
  input: {schema: LibraryMoodDetectionInputSchema},
  output: {schema: LibraryMoodDetectionOutputSchema},
  model: MODELS.PRO,
  prompt: `You are a music library curator with deep knowledge of genres, moods, and DJing. You analyze music collections to understand their emotional landscape and help DJs organize their libraries intelligently.

LIBRARY TO ANALYZE:
Tracks: {{{tracks}}}
Analysis Depth: {{{analysisDepth}}}
Custom Categories: {{{customCategories}}}

YOUR TASK:
Analyze this music library and categorize tracks by mood, energy, and vibe.

MOOD CATEGORIES (use these or custom ones):
- **Euphoric/Uplifting**: High energy, positive, peak-time tracks
- **Dark/Hypnotic**: Moody, mysterious, underground vibes
- **Groovy/Funky**: Mid-tempo, rhythmic, danceable
- **Melancholic/Emotional**: Introspective, touching, deep
- **Aggressive/Hard**: Intense, driving, powerful
- **Chill/Ambient**: Relaxed, atmospheric, downtempo
- **Tribal/Percussive**: Drums-focused, ethnic influences
- **Tech/Minimal**: Clean, precise, understated
- **Progressive/Building**: Gradual builds, journey-focused
- **Classic/Timeless**: Well-known, crowd-pleasers

ANALYSIS APPROACH:

1. **Identify Mood Patterns**
   - Look at track titles, artists, genres
   - Consider BPM ranges (slow=chill, fast=energetic)
   - Analyze key patterns (minor=darker, major=brighter)
   - Recognize genre conventions

2. **Energy Assessment**
   - Low (1-3): Ambient, downtempo, intro/outro material
   - Medium (4-7): Groovy, warm-up, versatile tracks
   - High (8-10): Peak-time, main room, festival material

3. **Genre Diversity**
   - Calculate genre distribution
   - Identify strengths and gaps
   - Note versatility or specialization

4. **Playlist Intelligence**
   - Group tracks into ready-made playlists
   - Suggest use cases (warm-up, peak, closing, etc.)
   - Consider BPM and key compatibility
   - Create flow-friendly collections

5. **Insights**
   - What's this DJ's style?
   - What's missing from the collection?
   - What are the strongest categories?
   - What unique combinations exist?

For each mood category:
- Name it descriptively
- Explain what defines it
- Rate average energy
- List tracks that fit
- Show BPM range if applicable
- Note dominant keys
- Suggest when/where to play these tracks

Create suggested playlists that:
- Have a clear purpose (e.g., "Dark Techno Opening Set")
- Flow well together (BPM/key compatible)
- Serve specific use cases
- Range from 5-15 tracks

Provide actionable insights that help the DJ:
- Understand their collection
- Find gaps to fill
- Discover new combinations
- Organize more effectively

Be detailed, insightful, and practical!`,
});

const libraryMoodDetectionFlow = ai.defineFlow(
  {
    name: 'libraryMoodDetectionFlow',
    inputSchema: LibraryMoodDetectionInputSchema,
    outputSchema: LibraryMoodDetectionOutputSchema,
  },
  async (input: LibraryMoodDetectionInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
