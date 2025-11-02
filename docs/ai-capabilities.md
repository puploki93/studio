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

---

### 6. Voice-Controlled DJ Assistant 🎤
**Natural language DJ commands and queries**

**What it does:**
- Understands natural language commands and questions
- Provides context-aware DJ assistance
- Parses commands into actionable parameters
- Maintains conversation history
- Adapts responses to DJ experience level

**Supported interaction types:**
- **Information Requests**: "What BPM is this?", "What key am I in?"
- **Mixing Suggestions**: "What should I play next?", "How do I transition?"
- **Direct Commands**: "Load a techno track", "Add a filter effect"
- **Learning Requests**: "How do I do a bass swap?", "Teach me harmonic mixing"
- **Warnings/Alerts**: "The tracks aren't in key", "BPM jump too big"
- **Playlist Management**: "Create a sunset playlist", "Sort by energy"
- **Track Requests**: "Play something energetic", "Find tracks in A minor"

**Features:**
- Confidence scoring (0-100%)
- Action type classification
- Command parameter extraction
- Suggested follow-up actions
- Conversational responses

**Use case:**
```
Input: "What should I play after this techno track to build energy?"
Output:
- Type: Suggestion
- Response: "To build energy from your current techno track, I'd recommend
  moving to a faster BPM track (133-138) with higher energy. Look for tracks
  in compatible keys..."
- Suggested Actions: ["Search for 135 BPM techno", "Filter by energy level 8+"]
- Confidence: 95%
```

---

### 7. AI Transition Generator ⚡
**Creative step-by-step transition sequences**

**What it does:**
- Generates complete transition choreography between two tracks
- Provides timeline-based execution steps
- Includes specific parameter values
- Tailored to transition style and length

**Transition Styles:**
- **Smooth**: Seamless blends, gentle EQ, long overlaps
- **Energetic**: Quick cuts, dynamic effects, anticipation
- **Dramatic**: Big impacts, creative effects, surprise elements
- **Creative**: Experimental, genre-blending, innovative
- **Minimal**: Clean, precise, technical

**Transition Lengths:**
- Quick (8-16 bars)
- Medium (16-32 bars)
- Long (32-64 bars)
- Extended (64+ bars)

**Features:**
- Creative transition names
- Step-by-step timeline with timestamps
- Deck-specific actions (A, B, both)
- Exact parameter values (volume, EQ, crossfader, effects)
- Key moment highlights
- Pro tips for execution
- Difficulty ratings
- Visual cues for waveform watching

**Use case:**
```
Input:
- From: "Caribou - Can't Do Without You" (124 BPM, G)
- To: "Bicep - Glue" (128 BPM, Am)
- Style: Creative
- Length: Medium

Output:
- Name: "Filter Rise to Harmonic Drop"
- Duration: 28 bars
- Steps: 12 detailed actions with timing and parameters
- Key Moments: "Bar 16: Full filter sweep", "Bar 24: Bass swap"
- Difficulty: Intermediate
```

---

### 8. Library Mood Detection 📚
**Intelligent music library analysis and organization**

**What it does:**
- Analyzes entire music collections
- Categorizes tracks by mood, energy, and vibe
- Generates auto-playlists
- Provides collection insights and recommendations

**Analysis Categories:**
- Euphoric/Uplifting
- Dark/Hypnotic
- Groovy/Funky
- Melancholic/Emotional
- Aggressive/Hard
- Chill/Ambient
- Tribal/Percussive
- Tech/Minimal
- Progressive/Building
- Classic/Timeless

**Features:**
- Energy distribution analysis (low/medium/high %)
- Genre diversity breakdown
- BPM range per category
- Dominant keys identification
- Auto-generated playlists with use cases
- Library insights (gaps, strengths, unique combinations)
- Track count per mood
- Playlist suggestions for different scenarios

**Use case:**
```
Input: 150 tracks from your library
Output:
- Overview: "Techno-focused collection with strong dark/hypnotic presence"
- Mood Categories: 8 detected with tracks sorted
- Energy: 15% low, 45% medium, 40% high
- Genre Mix: 60% Techno, 25% House, 15% Other
- Suggested Playlists: "Dark Opening Set (12 tracks)",
  "Peak Time Power (15 tracks)", etc.
- Insights: "Strong 128-135 BPM range, consider adding more 140+ for variety"
```

---

### 9. Intelligent Looping & Hot-Cue Suggestions 🎯
**Performance-ready cue points and creative loops**

**What it does:**
- Suggests 8 optimal hot cue points per track
- Recommends creative loop opportunities
- Color-codes cues for visual organization
- Tailors suggestions to DJ style

**Hot Cue System:**
- Color-coded by purpose (Red/Orange/Yellow/Green/Blue/Purple/Pink/White)
- Essential cues: First Beat, Drop, Breakdown, Buildup, Outro
- Optional cues: Vocals, Percussion, Special Moments
- Position, name, purpose, and use case for each

**Loop Types:**
- **Standard**: 4-bar drums, 8-bar melodic, 16-bar phrases
- **Creative**: 1-bar stutters, 2-bar vocals, 32-bar suspense
- **Techniques**: Roll In, Echo Out, Layer, Extend, Chop

**DJ Style Adaptation:**
- Mixing: Practical cues for quick access
- Performance: Creative loops and stutter points
- Live Remix: Multiple short loops, vocal cuts
- Turntablist: Scratching points, clean drums

**Features:**
- Track structure analysis
- Performance tips
- Mixing strategy using cues
- Creative manipulation ideas
- Quick setup guide for gigs
- Loop difficulty ratings

**Use case:**
```
Input:
- Track: "Nina Kraviz - Ghetto Kraviz"
- Genre: Techno
- Style: Performance

Output:
- 8 Hot Cues: #1 First Kick (Red, 0:08), #2 Main Drop (Green, 1:32), etc.
- 6 Loops: "4-bar Drum Loop" at breakdown, "1-bar Stutter" for effects, etc.
- Structure: "Long intro (64 bars) → breakdown → buildup → drop → outro"
- Performance Tips: "Use cue #3 for quick energy drops", etc.
```

---

## Genre Knowledge Base

DJ Glitch includes a comprehensive genre database covering 8 major genres with detailed information:

**Genres Covered:**
- Techno (120-150 BPM)
- House (118-135 BPM)
- Drum & Bass (160-180 BPM)
- Trance (125-150 BPM)
- Dubstep (130-145 BPM)
- Hip-Hop (60-100 BPM)
- Disco (110-130 BPM)
- Ambient (60-90 BPM)

**For Each Genre:**
- BPM range (min/max/typical)
- Common musical keys
- Energy levels (1-10 scale)
- Characteristics and sound design
- Mixing tips and techniques
- Common effects usage
- Cultural context and history
- Subgenres
- Iconic artists
- Compatible genres for mixing

This knowledge enhances all AI prompts with genre-specific context.

---

## Music Theory Integration

### Camelot Wheel
- Complete harmonic mixing system
- 24 keys (12 major, 12 minor) mapped to Camelot codes
- Compatible key detection
- Energy progression guidance (up/down/same)
- Relationship analysis (perfect match, relative, adjacent)

### BPM Compatibility
- Percentage difference calculation
- Pitch adjustment recommendations (±6% ideal, ±10% max)
- Optimal sync BPM finder
- Double/half-time relationship detection
- Tempo compatibility advice

### Key Estimation
- Genre-based key suggestions
- Mood-based key recommendations
- Next key suggestions for energy flow

---

## Music API Integration

### Spotify Web API ✅
- Full OAuth token management
- Track search with metadata
- Audio features: BPM, key, energy, danceability, valence
- Audio analysis for detailed breakdowns
- AI-powered track recommendations
- Playlist fetching
- Pitch class to musical key conversion

### SoundCloud API (Placeholder)
- Integration ready for when API access available

### Unified Service
- Multi-platform music API service
- Consistent interface across providers
- Easy service switching

---

## Integration Guide

### Using AI Flows in Your Code

```typescript
// Existing flows
import { generateMoodBasedPlaylist } from '@/ai/flows/generate-mood-based-playlist';
import { getAIAssistedMixingAdvice } from '@/ai/flows/ai-assisted-mixing';
import { analyzeAlbumArt } from '@/ai/flows/analyze-album-art';
import { getTrackRecommendations } from '@/ai/flows/track-recommendations';
import { getEQSuggestions } from '@/ai/flows/audio-eq-analysis';

// New flows
import { voiceDJAssistant } from '@/ai/flows/voice-dj-assistant';
import { generateTransition } from '@/ai/flows/generate-transitions';
import { detectLibraryMood } from '@/ai/flows/library-mood-detection';
import { getLoopHotcueSuggestions } from '@/ai/flows/loop-hotcue-suggestions';

// Music theory utilities
import { areKeysCompatible, calculateBPMCompatibility } from '@/ai/utils/music-theory';
import { getGenreInfo, formatGenreContext } from '@/ai/knowledge/genre-database';

// Music API
import { musicAPI } from '@/lib/music-api';

// Voice assistant
const response = await voiceDJAssistant({
  query: "What should I play next?",
  currentContext: { currentTrack: "Track A", currentBpm: 130 }
});

// Generate transition
const transition = await generateTransition({
  fromTrack: "Track A",
  toTrack: "Track B",
  transitionStyle: "creative",
  transitionLength: "medium"
});

// Library mood detection
const analysis = await detectLibraryMood({
  tracks: yourTrackList,
  analysisDepth: "detailed"
});

// Loop and cue suggestions
const cues = await getLoopHotcueSuggestions({
  trackName: "Artist - Track",
  genre: "Techno",
  djStyle: "performance"
});

// Music theory
const keyCompat = areKeysCompatible("Am", "C");
const bpmCompat = calculateBPMCompatibility(128, 130);

// Spotify integration
const searchResults = await musicAPI.search("techno 130 bpm");
const trackDetails = await musicAPI.getTrack("spotify:track:123");
```

## Future Enhancements

Potential additions:
- Real-time audio analysis from microphone input
- BPM detection from uploaded tracks
- Key detection using audio analysis
- Automatic beatmatching suggestions
- Set recording analysis and feedback
- Crowd response prediction
- Apple Music API integration
- YouTube Music integration
- Beatport integration

---

Built with ❤️ using Google Gemini AI
