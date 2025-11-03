/**
 * @fileOverview Audio analysis service using Web Audio API
 */

import type {
  AudioAnalysisResult,
  AudioFeatures,
  BeatInfo,
  FrequencyData,
} from './types';

export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyserNode: AnalyserNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;
  }

  /**
   * Load and decode audio file
   */
  async loadAudioFile(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  /**
   * Analyze audio buffer and extract features
   */
  async analyzeAudio(audioBuffer: AudioBuffer): Promise<AudioAnalysisResult> {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Extract features
    const bpm = this.detectBPM(channelData, sampleRate);
    const key = this.detectKey(channelData, sampleRate);
    const beats = this.detectBeats(channelData, sampleRate, bpm);
    const energy = this.calculateEnergy(channelData);
    const energyCurve = this.calculateEnergyCurve(channelData, sampleRate);

    // Create frequency data
    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);

    const features: AudioFeatures = {
      bpm,
      key,
      energy,
      danceability: this.calculateDanceability(beats, energy),
      loudness: this.calculateLoudness(channelData),
      tempo: bpm,
      timeSignature: 4, // Assume 4/4 for now
      duration,
    };

    return {
      features,
      beats,
      waveform: channelData,
      frequencyData,
      energyCurve,
      spectralCentroid: this.calculateSpectralCentroid(channelData, sampleRate),
      spectralRolloff: this.calculateSpectralRolloff(channelData, sampleRate),
      zeroCrossingRate: this.calculateZeroCrossingRate(channelData),
    };
  }

  /**
   * Detect BPM using autocorrelation
   */
  private detectBPM(audioData: Float32Array, sampleRate: number): number {
    const minBPM = 60;
    const maxBPM = 200;
    const windowSize = Math.floor(sampleRate * 10); // 10 seconds

    // Take a sample from the middle of the track
    const startSample = Math.floor((audioData.length - windowSize) / 2);
    const sample = audioData.slice(startSample, startSample + windowSize);

    // Calculate energy envelope
    const envelope = this.calculateEnergyEnvelope(sample, sampleRate);

    // Find peaks in the envelope
    const peaks = this.findPeaks(envelope, sampleRate);

    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }

    // Find most common interval
    const medianInterval = this.median(intervals);
    const bpm = Math.round(60 / medianInterval);

    // Clamp to reasonable range
    if (bpm < minBPM) return bpm * 2;
    if (bpm > maxBPM) return bpm / 2;

    return bpm;
  }

  /**
   * Detect musical key using chromagram
   */
  private detectKey(audioData: Float32Array, sampleRate: number): string {
    // Simplified key detection - in production, use a library like essentia.js
    // For now, return a placeholder
    const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const modes = ['', 'm']; // Major or minor

    // Calculate energy in different pitch classes
    const pitchClasses = new Array(12).fill(0);
    const fftSize = 2048;
    const hopSize = 512;

    for (let i = 0; i < audioData.length - fftSize; i += hopSize) {
      const frame = audioData.slice(i, i + fftSize);
      const spectrum = this.fft(frame);

      // Map frequencies to pitch classes (simplified)
      spectrum.forEach((magnitude, bin) => {
        const frequency = (bin * sampleRate) / fftSize;
        const pitchClass = Math.round(12 * Math.log2(frequency / 440)) % 12;
        if (pitchClass >= 0 && pitchClass < 12) {
          pitchClasses[pitchClass] += magnitude;
        }
      });
    }

    // Find dominant pitch class
    const dominantPitch = pitchClasses.indexOf(Math.max(...pitchClasses));

    // Determine if major or minor (simplified - check third interval)
    const isMajor = pitchClasses[(dominantPitch + 4) % 12] > pitchClasses[(dominantPitch + 3) % 12];

    return keys[dominantPitch] + (isMajor ? '' : 'm');
  }

  /**
   * Detect beat positions
   */
  private detectBeats(audioData: Float32Array, sampleRate: number, bpm: number): BeatInfo[] {
    const beatInterval = (60 / bpm) * sampleRate; // samples per beat
    const beats: BeatInfo[] = [];

    // Calculate energy envelope
    const envelope = this.calculateEnergyEnvelope(audioData, sampleRate);

    // Find peaks that align with expected beat positions
    let expectedBeatPosition = 0;
    let beatCount = 0;

    while (expectedBeatPosition < envelope.length) {
      // Look for peak near expected position
      const searchStart = Math.max(0, expectedBeatPosition - beatInterval * 0.1);
      const searchEnd = Math.min(envelope.length, expectedBeatPosition + beatInterval * 0.1);

      let maxEnergy = 0;
      let maxPosition = expectedBeatPosition;

      for (let i = searchStart; i < searchEnd; i++) {
        if (envelope[i] > maxEnergy) {
          maxEnergy = envelope[i];
          maxPosition = i;
        }
      }

      beats.push({
        position: maxPosition / sampleRate,
        confidence: Math.min(maxEnergy, 1),
        isBeatOne: beatCount % 4 === 0,
        isPhraseStart: beatCount % 16 === 0,
      });

      expectedBeatPosition += beatInterval;
      beatCount++;
    }

    return beats;
  }

  /**
   * Calculate overall energy
   */
  private calculateEnergy(audioData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    return Math.sqrt(sum / audioData.length);
  }

  /**
   * Calculate energy curve over time
   */
  private calculateEnergyCurve(audioData: Float32Array, sampleRate: number): number[] {
    const windowSize = sampleRate; // 1 second windows
    const curve: number[] = [];

    for (let i = 0; i < audioData.length; i += windowSize) {
      const window = audioData.slice(i, Math.min(i + windowSize, audioData.length));
      const energy = this.calculateEnergy(window);
      // Normalize to 0-10 scale
      curve.push(Math.min(energy * 20, 10));
    }

    return curve;
  }

  /**
   * Calculate danceability based on rhythm strength
   */
  private calculateDanceability(beats: BeatInfo[], energy: number): number {
    if (beats.length === 0) return 0;

    // Average beat confidence
    const avgConfidence = beats.reduce((sum, beat) => sum + beat.confidence, 0) / beats.length;

    // Combine with energy
    return (avgConfidence * 0.7 + energy * 0.3);
  }

  /**
   * Calculate loudness in dB
   */
  private calculateLoudness(audioData: Float32Array): number {
    const rms = Math.sqrt(
      audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length
    );
    return 20 * Math.log10(rms);
  }

  /**
   * Calculate energy envelope
   */
  private calculateEnergyEnvelope(audioData: Float32Array, sampleRate: number): Float32Array {
    const hopSize = 512;
    const windowSize = 2048;
    const envelope = new Float32Array(Math.floor(audioData.length / hopSize));

    for (let i = 0; i < envelope.length; i++) {
      const start = i * hopSize;
      const end = Math.min(start + windowSize, audioData.length);
      let energy = 0;

      for (let j = start; j < end; j++) {
        energy += audioData[j] * audioData[j];
      }

      envelope[i] = Math.sqrt(energy / (end - start));
    }

    return envelope;
  }

  /**
   * Find peaks in a signal
   */
  private findPeaks(signal: Float32Array, sampleRate: number): number[] {
    const peaks: number[] = [];
    const minPeakDistance = Math.floor(sampleRate * 0.3); // Min 300ms between peaks

    let lastPeakIndex = -minPeakDistance;

    for (let i = 1; i < signal.length - 1; i++) {
      if (
        signal[i] > signal[i - 1] &&
        signal[i] > signal[i + 1] &&
        i - lastPeakIndex >= minPeakDistance
      ) {
        peaks.push(i / (signal.length / sampleRate));
        lastPeakIndex = i;
      }
    }

    return peaks;
  }

  /**
   * Simple FFT (Fast Fourier Transform) implementation
   * In production, use a library like fft.js
   */
  private fft(signal: Float32Array): Float32Array {
    // Placeholder - return magnitude spectrum
    const magnitude = new Float32Array(signal.length / 2);
    for (let i = 0; i < magnitude.length; i++) {
      magnitude[i] = Math.abs(signal[i]);
    }
    return magnitude;
  }

  /**
   * Calculate spectral centroid
   */
  private calculateSpectralCentroid(audioData: Float32Array, sampleRate: number): number {
    const spectrum = this.fft(audioData);
    let weightedSum = 0;
    let sum = 0;

    for (let i = 0; i < spectrum.length; i++) {
      const frequency = (i * sampleRate) / (spectrum.length * 2);
      weightedSum += frequency * spectrum[i];
      sum += spectrum[i];
    }

    return sum > 0 ? weightedSum / sum : 0;
  }

  /**
   * Calculate spectral rolloff
   */
  private calculateSpectralRolloff(audioData: Float32Array, sampleRate: number): number {
    const spectrum = this.fft(audioData);
    const totalEnergy = spectrum.reduce((sum, val) => sum + val, 0);
    const threshold = totalEnergy * 0.85;

    let cumulativeEnergy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      cumulativeEnergy += spectrum[i];
      if (cumulativeEnergy >= threshold) {
        return (i * sampleRate) / (spectrum.length * 2);
      }
    }

    return sampleRate / 2;
  }

  /**
   * Calculate zero crossing rate
   */
  private calculateZeroCrossingRate(audioData: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < audioData.length; i++) {
      if ((audioData[i] >= 0 && audioData[i - 1] < 0) || (audioData[i] < 0 && audioData[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / audioData.length;
  }

  /**
   * Calculate median of an array
   */
  private median(arr: number[]): number {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  /**
   * Get frequency data for a specific time
   */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Get time domain data (waveform)
   */
  getTimeDomainData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Connect audio element to analyzer
   */
  connectAudioElement(audioElement: HTMLAudioElement): AnalyserNode {
    const source = this.audioContext.createMediaElementSource(audioElement);
    source.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
    return this.analyserNode;
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Export singleton instance
export const audioAnalyzer = new AudioAnalyzer();
