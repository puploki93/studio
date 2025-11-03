/**
 * @fileOverview Audio analysis types and interfaces for DJ Glitch
 */

export interface AudioFeatures {
  bpm: number;
  key: string;
  energy: number; // 0-1
  danceability: number; // 0-1
  loudness: number; // dB
  tempo: number;
  timeSignature: number;
  duration: number; // seconds
}

export interface BeatInfo {
  position: number; // seconds
  confidence: number; // 0-1
  isBeatOne: boolean; // first beat of a bar
  isPhraseStart: boolean; // phrase boundary
}

export interface FrequencyData {
  subBass: number; // 20-60 Hz
  bass: number; // 60-250 Hz
  lowMids: number; // 250-500 Hz
  mids: number; // 500-2000 Hz
  highMids: number; // 2000-4000 Hz
  presence: number; // 4000-6000 Hz
  brilliance: number; // 6000-20000 Hz
}

export interface AudioAnalysisResult {
  features: AudioFeatures;
  beats: BeatInfo[];
  waveform: Float32Array;
  frequencyData: Uint8Array;
  energyCurve: number[]; // Energy level per second
  spectralCentroid: number;
  spectralRolloff: number;
  zeroCrossingRate: number;
}

export interface TrackStructure {
  intro: { start: number; end: number } | null;
  verse: Array<{ start: number; end: number }>;
  chorus: Array<{ start: number; end: number }>;
  breakdown: Array<{ start: number; end: number }>;
  buildup: Array<{ start: number; end: number }>;
  drop: Array<{ start: number; end: number }>;
  outro: { start: number; end: number } | null;
}

export interface WaveformVisualization {
  canvas: HTMLCanvasElement;
  audioData: Float32Array;
  frequencyBands: {
    bass: Float32Array;
    mids: Float32Array;
    highs: Float32Array;
  };
  markers: {
    beats: number[];
    phrases: number[];
    hotCues: Array<{ position: number; color: string; name: string }>;
    loops: Array<{ start: number; end: number; name: string }>;
  };
}

export interface SpectrumAnalyzerConfig {
  fftSize: 2048 | 4096 | 8192 | 16384;
  smoothingTimeConstant: number; // 0-1
  minDecibels: number;
  maxDecibels: number;
}

export interface EnergyAnalysis {
  timestamp: number;
  energy: number; // 0-10 scale
  bass: number;
  mids: number;
  highs: number;
}

export interface BeatPhaseInfo {
  deckAPosition: number;
  deckBPosition: number;
  deckANextBeat: number;
  deckBNextBeat: number;
  phase: number; // 0-1, where 0 is perfectly in sync
  bpmDifference: number;
  synced: boolean;
}

export interface AudioProcessingNode {
  context: AudioContext;
  source: AudioBufferSourceNode | MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  gainNode: GainNode;
  biquadFilter: BiquadFilterNode;
  compressor: DynamicsCompressorNode;
  destination: AudioDestinationNode;
}

export interface DeckState {
  playing: boolean;
  position: number; // seconds
  bpm: number;
  key: string;
  volume: number; // 0-1
  eq: {
    low: number; // -1 to 1
    mid: number;
    high: number;
  };
  filter: number; // 0-1
  pitch: number; // -100 to 100 (percentage)
}

export interface MixerState {
  deckA: DeckState;
  deckB: DeckState;
  crossfader: number; // 0-1, 0=A, 1=B
  masterVolume: number; // 0-1
  headphoneVolume: number; // 0-1
  headphoneCue: 'A' | 'B' | 'master';
}
