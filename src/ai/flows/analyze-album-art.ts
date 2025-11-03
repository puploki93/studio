'use server';

/**
 * @fileOverview Album art analysis using multimodal AI to understand music vibe from artwork.
 *
 * - analyzeAlbumArt - A function that analyzes album artwork to determine music style and vibe.
 * - AnalyzeAlbumArtInput - The input type for the analyzeAlbumArt function.
 * - AnalyzeAlbumArtOutput - The return type for the analyzeAlbumArt function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAlbumArtInputSchema = z.object({
  imageUrl: z
    .string()
    .describe('URL or base64 data URI of the album artwork to analyze.'),
  trackName: z.string().optional().describe('Optional track or album name for context'),
});
export type AnalyzeAlbumArtInput = z.infer<typeof AnalyzeAlbumArtInputSchema>;

const AnalyzeAlbumArtOutputSchema = z.object({
  vibeDescription: z
    .string()
    .describe('Description of the visual vibe and mood conveyed by the artwork'),
  suggestedGenres: z
    .array(z.string())
    .describe('Genres suggested by the visual style of the artwork'),
  colorPalette: z
    .array(z.string())
    .describe('Dominant colors in the artwork (e.g., ["dark blue", "neon pink"])'),
  energyLevel: z
    .number()
    .min(1)
    .max(10)
    .describe('Estimated energy level based on visual elements (1=calm, 10=intense)'),
  mood: z
    .string()
    .describe('Overall mood or emotion conveyed (e.g., "melancholic", "euphoric", "aggressive")'),
  mixingRecommendations: z
    .string()
    .describe('Suggestions for what kind of tracks this would mix well with based on the visual vibe'),
});
export type AnalyzeAlbumArtOutput = z.infer<typeof AnalyzeAlbumArtOutputSchema>;

export async function analyzeAlbumArt(
  input: AnalyzeAlbumArtInput
): Promise<AnalyzeAlbumArtOutput> {
  return analyzeAlbumArtFlow(input);
}

const prompt = ai.definePrompt(
  {
    name: 'analyzeAlbumArtPrompt',
    input: {schema: AnalyzeAlbumArtInputSchema},
    output: {schema: AnalyzeAlbumArtOutputSchema},
    model: MODELS.VISION, // Use the vision-capable model
  },
  async (input: AnalyzeAlbumArtInput) => {
    const media = {url: input.imageUrl};
    return {
      messages: [
        {
          role: 'user',
          content: [
            {media},
            {
              text: `You are an expert music curator and visual artist who understands the relationship between album artwork and music style.

Analyze this album artwork${input.trackName ? ` for "${input.trackName}"` : ''} and provide insights about the music's likely characteristics.

Consider:
1. Visual style and artistic approach
2. Color palette and mood
3. Typography and design elements
4. Cultural and genre associations
5. Energy conveyed through the artwork

Provide a comprehensive analysis including:
- Vibe description (what feelings and atmosphere the art conveys)
- Suggested genres based on visual cues
- Dominant color palette
- Energy level (1-10 scale)
- Overall mood
- Mixing recommendations (what kind of tracks this would pair well with in a DJ set)

Be specific and insightful, drawing connections between visual elements and musical characteristics.`,
            },
          ],
        },
      ],
    };
  }
);

const analyzeAlbumArtFlow = ai.defineFlow(
  {
    name: 'analyzeAlbumArtFlow',
    inputSchema: AnalyzeAlbumArtInputSchema,
    outputSchema: AnalyzeAlbumArtOutputSchema,
  },
  async (input: AnalyzeAlbumArtInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
