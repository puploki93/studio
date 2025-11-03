/**
 * @fileOverview React hooks for audio analysis
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioAnalyzer } from '@/lib/audio/analyzer';
import { frequencyAnalyzer } from '@/lib/audio/frequency-analyzer';
import type {
  AudioAnalysisResult,
  FrequencyData,
  BeatPhaseInfo,
} from '@/lib/audio/types';

/**
 * Hook for analyzing an audio file
 */
export function useAudioFileAnalysis() {
  const [analysis, setAnalysis] = useState<AudioAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const audioBuffer = await audioAnalyzer.loadAudioFile(file);
      const result = await audioAnalyzer.analyzeAudio(audioBuffer);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze audio');
      console.error('Audio analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analysis, isAnalyzing, error, analyzeFile };
}

/**
 * Hook for real-time frequency analysis
 */
export function useFrequencyAnalysis(audioElement: HTMLAudioElement | null) {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array());
  const [frequencyBands, setFrequencyBands] = useState<FrequencyData>({
    subBass: 0,
    bass: 0,
    lowMids: 0,
    mids: 0,
    highMids: 0,
    presence: 0,
    brilliance: 0,
  });
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!audioElement) return;

    // Connect audio element to analyzer
    analyserRef.current = audioAnalyzer.connectAudioElement(audioElement);

    // Start animation loop
    const updateFrequencyData = () => {
      if (!analyserRef.current) return;

      const data = audioAnalyzer.getFrequencyData();
      setFrequencyData(data);

      const bands = frequencyAnalyzer.splitFrequencyBands(data);
      setFrequencyBands(bands);

      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    updateFrequencyData();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  return { frequencyData, frequencyBands };
}

/**
 * Hook for waveform data
 */
export function useWaveformData(audioElement: HTMLAudioElement | null) {
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!audioElement) return;

    analyserRef.current = audioAnalyzer.connectAudioElement(audioElement);

    const updateWaveform = () => {
      if (!analyserRef.current) return;

      const data = audioAnalyzer.getTimeDomainData();
      setWaveformData(data);

      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  return waveformData;
}

/**
 * Hook for beat phase alignment between two decks
 */
export function useBeatPhaseAlignment(
  deckAElement: HTMLAudioElement | null,
  deckBElement: HTMLAudioElement | null,
  deckABpm: number,
  deckBBpm: number
) {
  const [phaseInfo, setPhaseInfo] = useState<BeatPhaseInfo>({
    deckAPosition: 0,
    deckBPosition: 0,
    deckANextBeat: 0,
    deckBNextBeat: 0,
    phase: 0,
    bpmDifference: 0,
    synced: false,
  });

  useEffect(() => {
    if (!deckAElement || !deckBElement) return;

    const interval = setInterval(() => {
      const posA = deckAElement.currentTime;
      const posB = deckBElement.currentTime;

      // Calculate beat positions
      const beatLengthA = 60 / deckABpm;
      const beatLengthB = 60 / deckBBpm;

      const beatPositionA = (posA % beatLengthA) / beatLengthA;
      const beatPositionB = (posB % beatLengthB) / beatLengthB;

      // Calculate phase difference (0 = in sync, 0.5 = completely out of sync)
      let phase = Math.abs(beatPositionA - beatPositionB);
      if (phase > 0.5) phase = 1 - phase;

      // Next beat times
      const nextBeatA = posA + (beatLengthA - (posA % beatLengthA));
      const nextBeatB = posB + (beatLengthB - (posB % beatLengthB));

      setPhaseInfo({
        deckAPosition: posA,
        deckBPosition: posB,
        deckANextBeat: nextBeatA,
        deckBNextBeat: nextBeatB,
        phase,
        bpmDifference: Math.abs(deckABpm - deckBBpm),
        synced: phase < 0.1, // Considered synced if within 10% of a beat
      });
    }, 50); // Update 20 times per second

    return () => clearInterval(interval);
  }, [deckAElement, deckBElement, deckABpm, deckBBpm]);

  return phaseInfo;
}

/**
 * Hook for detecting frequency collisions
 */
export function useFrequencyCollisions(
  deckAElement: HTMLAudioElement | null,
  deckBElement: HTMLAudioElement | null
) {
  const [collisions, setCollisions] = useState<Array<{ frequency: number; severity: number }>>([]);
  const analyserARef = useRef<AnalyserNode | null>(null);
  const analyserBRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!deckAElement || !deckBElement) return;

    analyserARef.current = audioAnalyzer.connectAudioElement(deckAElement);
    analyserBRef.current = audioAnalyzer.connectAudioElement(deckBElement);

    const updateCollisions = () => {
      if (!analyserARef.current || !analyserBRef.current) return;

      const dataA = audioAnalyzer.getFrequencyData();
      const dataB = audioAnalyzer.getFrequencyData();

      const detected = frequencyAnalyzer.detectCollisions(dataA, dataB, 0.6);
      setCollisions(detected);

      animationFrameRef.current = requestAnimationFrame(updateCollisions);
    };

    updateCollisions();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [deckAElement, deckBElement]);

  return collisions;
}
