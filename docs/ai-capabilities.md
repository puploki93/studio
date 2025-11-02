# DJ Glitch AI Capabilities

DJ Glitch features a powerful custom AI system built on Google's Gemini models, providing professional-level DJ assistance across multiple domains.

## AI Models

The system uses three different AI models optimized for specific tasks:

- **Gemini 2.5 Flash** - Fast, general-purpose AI for quick responses
- **Gemini 2.0 Pro** - Advanced reasoning for complex analysis
- **Gemini 2.0 Flash Exp** - Multimodal (vision + text) for image analysis

## AI Flows

### 1. Mood-Based Playlist Generator
**Enhanced with advanced music theory and DJ techniques**

**What it does:**
- Generates 10-track playlists based on mood or context
- Analyzes BPM compatibility for smooth mixing
- Uses Camelot wheel for harmonic key matching
- Designs intentional energy curves throughout the set
- Blends complementary genres

**Features:**
- Detailed track metadata (BPM, key, energy level, genre)
- Genre blend analysis
- Energy flow description
- Average BPM calculation
- Mix-compatible track selection

**Use case:**
```
Input: "A rainy day in a cyberpunk city"
Output: 10 tracks with 120-128 BPM, keys in harmonic progression,
energy building from 4/10 to 7/10, blending synthwave + ambient techno
```

---

### 2. AI-Assisted Mixing
**Professional mixing advice with technical precision**

**What it does:**
- Analyzes two tracks for mixing compatibility
- Provides BPM and tempo adjustment suggestions
- Analyzes harmonic key compatibility
- Recommends specific mixing techniques
- Suggests optimal mix points and timing
- Provides detailed EQ strategy

**Features:**
- BPM analysis (±% calculation, pitch adjustment advice)
- Key compatibility using Camelot wheel
- Energy flow analysis
- Recommended technique (Echo Out, Filter Mix, Bass Swap, etc.)
- Optimal mix point with bar counting
- Step-by-step transition guide
- EQ suggestions for both tracks
- Optional effects recommendations
- Experience-level tailored advice

**Use case:**
```
Input:
- Current: "Daft Punk - Around the World" (120 BPM, Am)
- Next: "Justice - D.A.N.C.E." (128 BPM, C)

Output:
- BPM: +6.7% difference, sync at 124 BPM
- Keys: Compatible (Am → C is +3 on Camelot)
- Technique: Bass Swap with Filter Mix
- Mix Point: Start 32 bars before Justice drop
- EQ: Cut Daft Punk bass at 80Hz, boost Justice presence at 4kHz
```

---

### 3. Album Art Analysis 🎨
**Multimodal AI analyzing visual artwork**

**What it does:**
- Analyzes album artwork using computer vision
- Determines music style from visual cues
- Extracts mood and energy from design elements
- Suggests mixing strategies based on artwork vibe

**Features:**
- Visual vibe description
- Genre suggestions from artwork style
- Color palette extraction
- Energy level estimation (1-10)
- Mood analysis
- Mixing recommendations

**Use case:**
```
Input: Album cover with neon pink/blue gradient, retro 80s typography
Output:
- Vibe: "Retro-futuristic synthwave energy"
- Genres: [Synthwave, Retrowave, Outrun]
- Colors: ["neon pink", "electric blue", "deep purple"]
- Energy: 7/10
- Mood: "Nostalgic yet energetic"
- Mix with: "Similar 80s-inspired tracks, BPM 110-130"
```

---

### 4. Intelligent Track Recommendations
**Context-aware AI DJ curation**

**What it does:**
- Recommends next tracks based on set context
- Considers crowd energy and DJ style
- Provides strategic set programming advice
- Avoids repetition from recent tracks

**Features:**
- 5 track recommendations with detailed reasoning
- Harmonic mixing compatibility
- BPM progression strategy
- Energy management based on context
- Quick mixing tips per track
- Vibe match scoring (1-10)
- Overall set strategy notes
- Energy curve advice for next 20-30 minutes

**Input parameters:**
- Current track info (name, BPM, key, genre)
- Set context (e.g., "peak time techno set")
- Crowd energy (low, building, peak, cooling_down)
- DJ style preferences
- Recent tracks played

**Use case:**
```
Input:
- Current: "Carl Cox - I Want You (Forever)" (130 BPM, Am)
- Context: "Peak time at underground techno club"
- Crowd: Peak energy
- Recent: [3 techno tracks]

Output: 5 tracks ranging 128-134 BPM, compatible keys,
maintaining peak energy with strategic progression
```

---

### 5. Audio EQ Analysis
**Professional audio engineering advice**

**What it does:**
- Provides frequency-specific EQ recommendations
- Tailored to venue/context (club, festival, studio)
- Genre-specific EQ strategies
- Mixing tips for track blending

**Features:**
- Overall EQ strategy
- Detailed frequency adjustments (20Hz - 20kHz)
- Sub-bass, bass, mids, highs breakdown
- Specific dB adjustments
- Filter type recommendations (shelf, bell, high/low pass)
- Bass swap timing
- Frequency masking prevention
- Optional compression advice

**Frequency ranges covered:**
- Sub-bass (20-60 Hz) - Club power
- Bass (60-250 Hz) - Warmth, kick drums
- Low-mids (250-500 Hz) - Clarity management
- Mids (500Hz-2kHz) - Vocals, melodic elements
- High-mids (2-4kHz) - Presence, definition
- Presence (4-6kHz) - Brightness, attack
- Brilliance (6-20kHz) - Air, sparkle

**Use case:**
```
Input:
- Track: "Amelie Lens - Feel It"
- Genre: Techno
- Context: Festival main stage
- Issue: "Bass feels weak on big system"

Output:
- Sub-bass: Boost +3dB at 50Hz (wide shelf)
- Bass: Cut -2dB at 200Hz (narrow bell) to reduce mud
- High-mids: Boost +4dB at 3kHz for presence on large system
- Brilliance: Add +2dB at 10kHz for outdoor clarity
```

## Technical Architecture

### Model Selection
Each flow uses the optimal model for its task:
- **Fast flows** (playlist, basic mixing): Gemini 2.5 Flash
- **Complex analysis** (track recommendations, EQ): Gemini 2.0 Pro
- **Vision tasks** (album art): Gemini 2.0 Flash Exp

### Type Safety
All flows use Zod schemas for:
- Input validation
- Output structure guarantee
- TypeScript type inference
- Runtime type checking

### Server-Side Execution
All AI flows run server-side ('use server') for:
- API key security
- Consistent performance
- Reduced client bundle size

## Integration Guide

### Using AI Flows in Your Code

```typescript
import { generateMoodBasedPlaylist } from '@/ai/flows/generate-mood-based-playlist';
import { getAIAssistedMixingAdvice } from '@/ai/flows/ai-assisted-mixing';
import { analyzeAlbumArt } from '@/ai/flows/analyze-album-art';
import { getTrackRecommendations } from '@/ai/flows/track-recommendations';
import { getEQSuggestions } from '@/ai/flows/audio-eq-analysis';

// Generate playlist
const playlist = await generateMoodBasedPlaylist({
  mood: "Late night deep house vibes"
});

// Get mixing advice
const mixAdvice = await getAIAssistedMixingAdvice({
  currentTrack: "Track A",
  nextTrack: "Track B",
  currentBpm: 128,
  nextBpm: 130,
  currentKey: "Am",
  nextKey: "C",
  djExperience: "intermediate",
  userPreferences: "Smooth long blends"
});

// Analyze album art
const artAnalysis = await analyzeAlbumArt({
  imageUrl: "https://example.com/album-art.jpg",
  trackName: "Artist - Track"
});

// Get track recommendations
const recommendations = await getTrackRecommendations({
  currentTrack: "Current track",
  currentBpm: 130,
  crowdEnergy: "peak",
  setContext: "Peak time techno set"
});

// Get EQ suggestions
const eqAdvice = await getEQSuggestions({
  trackName: "Track name",
  genre: "Techno",
  mixingContext: "club sound system"
});
```

## Future Enhancements

Potential additions:
- Real-time audio analysis from microphone input
- BPM detection from uploaded tracks
- Key detection using audio analysis
- Automatic beatmatching suggestions
- Set recording analysis and feedback
- Crowd response prediction
- Spotify/SoundCloud API integration for real track data
- Voice-controlled DJ assistant

---

Built with ❤️ using Google Gemini AI
