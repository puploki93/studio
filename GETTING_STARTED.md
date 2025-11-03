# DJ Glitch - Getting Started Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables (for AI features)

Create a `.env.local` file in the root directory:

```bash
# Required for AI features
GOOGLE_GENAI_API_KEY=your_google_api_key_here

# Optional: For Spotify integration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Optional: For SoundCloud (when available)
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
```

**How to get API keys:**

- **Google Gemini API Key**:
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Click "Get API Key"
  3. Copy your key

- **Spotify API Keys** (optional):
  1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
  2. Create an app
  3. Copy Client ID and Client Secret

### 3. Start the Development Server

```bash
npm run dev
```

The app will start on **http://localhost:9002**

### 4. Open in Browser

Open your browser and navigate to:
```
http://localhost:9002
```

---

## 🎛️ Using DJ Glitch

### Main Features & Where to Find Them

#### 1. **Dashboard** (Home Page)
Location: `http://localhost:9002`

Features:
- 🎵 **Universal Playlist Intelligence** - Generate mood-based playlists
- ✨ **AI DJ Mix Assistant** - Get intelligent mixing advice
- 🎤 **Voice Assistant** - Ask questions in natural language
- ⚡ **Transition Generator** - Create custom transitions

**Try it:**
```
1. Click on "Universal Playlist Intelligence"
2. Enter a mood like "Dark techno warm-up set"
3. Click "Generate Playlist"
4. See AI-generated tracks with BPM, key, energy, and genre!
```

#### 2. **Mixer View**
Location: `http://localhost:9002/mixer`

Features:
- Dual-deck DJ mixer interface
- Waveform visualizations
- Spectrum analyzer
- Beat phase alignment
- Energy timeline
- EQ controls
- Crossfader

#### 3. **Library**
Location: `http://localhost:9002/library`

Features:
- Your music collection
- AI mood detection
- Auto-generated playlists
- Track metadata

#### 4. **Profile**
Location: `http://localhost:9002/profile`

Features:
- User settings
- DJ preferences
- Set recordings

---

## 🎨 Visual Components You Built

### Using the Audio Visualizations

#### **Waveform Visualizer**
Shows your track with color-coded frequencies:
- 🔴 Red = Bass (20-250 Hz)
- 🟡 Yellow = Mids (250-4000 Hz)
- 🔵 Blue = Highs (4000-20000 Hz)
- 🟢 Green markers = Beats

**To use:**
```typescript
import { WaveformVisualizer } from '@/components/audio/waveform-visualizer';

<WaveformVisualizer
  analysis={audioAnalysis}
  currentTime={currentTime}
  duration={duration}
  showBeats={true}
  showHotCues={true}
/>
```

#### **Spectrum Analyzer**
Real-time frequency analysis of both decks:
- Top half = Deck A
- Bottom half = Deck B
- Red dots = Frequency collisions (fix with EQ!)

**To use:**
```typescript
import { SpectrumAnalyzer } from '@/components/audio/spectrum-analyzer';

<SpectrumAnalyzer
  deckAElement={audioElementA}
  deckBElement={audioElementB}
  showCollisions={true}
  showEQSuggestions={true}
/>
```

#### **Energy Timeline**
See energy flow throughout your track/set:
- Blue line = Actual energy
- Green dotted = AI suggested path
- Green dots = Peak moments

#### **Beat Phase Alignment**
Check if your decks are in sync:
- 🟢 Green = IN SYNC (perfect!)
- 🟡 Yellow = CLOSE (almost there)
- 🔴 Red = OUT OF SYNC (adjust!)

---

## 🤖 Using the AI Features

### 1. Voice-Controlled DJ Assistant

**Example queries:**
```
"What should I play after this techno track?"
"How do I do a bass swap?"
"Recommend tracks at 128 BPM"
"What's the best way to transition from house to techno?"
```

### 2. AI-Assisted Mixing

**Input:**
- Current track: "Daft Punk - Around the World"
- Next track: "Justice - D.A.N.C.E."
- Current BPM: 120, Key: Am
- Next BPM: 128, Key: C

**Output:**
- BPM compatibility analysis
- Harmonic key matching (Camelot wheel)
- Recommended mixing technique
- Step-by-step transition guide
- EQ suggestions
- Optimal mix point

### 3. AI Transition Generator

**Input:**
- From track & To track
- Style: Smooth/Energetic/Dramatic/Creative/Minimal
- Length: Quick/Medium/Long/Extended

**Output:**
- Complete step-by-step choreography
- Timeline with exact timing
- Volume, EQ, crossfader, effect parameters
- Pro tips for execution

### 4. Mood-Based Playlist Generator

**Input:**
- Mood: "Late night deep house vibes"

**Output:**
- 10 tracks with full metadata
- BPM, key, energy level, genre
- Genre blend analysis
- Energy curve description
- Average BPM

---

## 🎵 Testing Audio Analysis

To test the Phase 1 audio features:

1. **Upload an audio file:**
```typescript
import { useAudioFileAnalysis } from '@/hooks/use-audio-analysis';

const { analysis, isAnalyzing, analyzeFile } = useAudioFileAnalysis();

// In your component
<input type="file" accept="audio/*" onChange={(e) => {
  if (e.target.files?.[0]) {
    analyzeFile(e.target.files[0]);
  }
}} />

// Show results
{analysis && (
  <div>
    <p>BPM: {analysis.features.bpm}</p>
    <p>Key: {analysis.features.key}</p>
    <p>Energy: {analysis.features.energy}</p>
    <p>Beats detected: {analysis.beats.length}</p>
  </div>
)}
```

2. **View the visualizations:**
```typescript
<WaveformVisualizer analysis={analysis} />
<EnergyTimeline analysis={analysis} />
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Run AI development server (Genkit)
npm run genkit:dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 📁 Project Structure

```
DJ Glitch/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── (app)/
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── mixer/         # Mixer view
│   │   │   ├── library/       # Library
│   │   │   └── profile/       # Profile
│   │
│   ├── components/
│   │   ├── audio/             # 🆕 Phase 1 visualizations
│   │   │   ├── waveform-visualizer.tsx
│   │   │   ├── spectrum-analyzer.tsx
│   │   │   ├── energy-timeline.tsx
│   │   │   └── beat-phase-alignment.tsx
│   │   │
│   │   ├── dashboard/         # AI feature components
│   │   │   ├── playlist-generator.tsx
│   │   │   ├── mix-assistant.tsx
│   │   │   ├── voice-assistant.tsx
│   │   │   └── transition-generator.tsx
│   │   │
│   │   └── ui/                # UI primitives
│   │
│   ├── ai/
│   │   ├── flows/             # 9 AI flows
│   │   ├── knowledge/         # Genre database
│   │   └── utils/             # Music theory
│   │
│   ├── lib/
│   │   ├── audio/             # 🆕 Phase 1 audio analysis
│   │   │   ├── analyzer.ts
│   │   │   ├── frequency-analyzer.ts
│   │   │   └── types.ts
│   │   └── music-api.ts       # Spotify integration
│   │
│   └── hooks/
│       └── use-audio-analysis.ts  # 🆕 Phase 1 hooks
│
└── docs/                      # Comprehensive documentation
    ├── ai-capabilities.md
    ├── complete-ai-system.md
    └── recommended-enhancements.md
```

---

## 🎯 Quick Examples

### Example 1: Generate a Playlist
1. Go to Dashboard
2. Find "Universal Playlist Intelligence"
3. Enter: "Energetic 80s synthwave workout"
4. Click "Generate Playlist"
5. See 10 tracks with BPM 110-130, compatible keys, energy 7-9/10

### Example 2: Get Mixing Advice
1. Go to Dashboard
2. Find "AI DJ Mix Assistant"
3. Enter tracks and BPMs
4. Get detailed mixing advice with EQ suggestions

### Example 3: Ask the Voice Assistant
1. Go to Dashboard
2. Find "AI Voice DJ Assistant"
3. Type: "How do I harmonic mix?"
4. Get conversational explanation

### Example 4: Analyze Audio
1. Upload an MP3 file
2. AI detects: BPM, key, beats, energy
3. View waveform with beat markers
4. See frequency spectrum
5. Check energy timeline

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### AI features not working?
- Check that `GOOGLE_GENAI_API_KEY` is set in `.env.local`
- Restart the dev server after adding env variables

### Port 9002 already in use?
```bash
# Kill the process on port 9002
lsof -ti:9002 | xargs kill -9

# Or change the port in package.json
"dev": "next dev --turbopack -p 3000"
```

---

## 🚀 Next Steps

1. **Explore the Dashboard** - Try all AI features
2. **Test Audio Analysis** - Upload a track and see the magic
3. **Check the Mixer** - See the visualizations in action
4. **Read the Docs** - Explore `docs/` folder for detailed info
5. **Build Phase 2** - Add stem separation and smart effects!

---

## 💡 Pro Tips

- Use **Chrome or Edge** for best Web Audio API support
- **Upload high-quality audio files** (320kbps MP3 or WAV) for accurate analysis
- **Ask the Voice Assistant** anything - it has deep DJ knowledge
- **Try different transition styles** - each creates unique choreography
- **Watch the beat phase alignment** when mixing two tracks

---

**Enjoy DJ Glitch!** 🎧🔥

For questions or issues, check the docs in `/docs/` folder.
