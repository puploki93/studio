/**
 * @fileOverview Frequency analysis utilities for splitting audio into bands
 */

import type { FrequencyData } from './types';

export class FrequencyAnalyzer {
  private sampleRate: number;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
  }

  /**
   * Split frequency data into bands
   */
  splitFrequencyBands(frequencyData: Uint8Array): FrequencyData {
    const nyquist = this.sampleRate / 2;
    const binWidth = nyquist / frequencyData.length;

    // Define frequency ranges (in Hz)
    const ranges = {
      subBass: { min: 20, max: 60 },
      bass: { min: 60, max: 250 },
      lowMids: { min: 250, max: 500 },
      mids: { min: 500, max: 2000 },
      highMids: { min: 2000, max: 4000 },
      presence: { min: 4000, max: 6000 },
      brilliance: { min: 6000, max: 20000 },
    };

    const getBandEnergy = (min: number, max: number): number => {
      const minBin = Math.floor(min / binWidth);
      const maxBin = Math.min(Math.ceil(max / binWidth), frequencyData.length - 1);

      let sum = 0;
      let count = 0;

      for (let i = minBin; i <= maxBin; i++) {
        sum += frequencyData[i];
        count++;
      }

      return count > 0 ? sum / count / 255 : 0; // Normalize to 0-1
    };

    return {
      subBass: getBandEnergy(ranges.subBass.min, ranges.subBass.max),
      bass: getBandEnergy(ranges.bass.min, ranges.bass.max),
      lowMids: getBandEnergy(ranges.lowMids.min, ranges.lowMids.max),
      mids: getBandEnergy(ranges.mids.min, ranges.mids.max),
      highMids: getBandEnergy(ranges.highMids.min, ranges.highMids.max),
      presence: getBandEnergy(ranges.presence.min, ranges.presence.max),
      brilliance: getBandEnergy(ranges.brilliance.min, ranges.brilliance.max),
    };
  }

  /**
   * Detect frequency collisions between two tracks
   */
  detectCollisions(
    frequencyDataA: Uint8Array,
    frequencyDataB: Uint8Array,
    threshold: number = 0.7
  ): Array<{ frequency: number; severity: number }> {
    const collisions: Array<{ frequency: number; severity: number }> = [];
    const nyquist = this.sampleRate / 2;
    const binWidth = nyquist / frequencyDataA.length;

    for (let i = 0; i < Math.min(frequencyDataA.length, frequencyDataB.length); i++) {
      const levelA = frequencyDataA[i] / 255;
      const levelB = frequencyDataB[i] / 255;

      // Both tracks have significant energy in this bin
      if (levelA > threshold && levelB > threshold) {
        const frequency = i * binWidth;
        const severity = Math.min(levelA, levelB);

        collisions.push({ frequency, severity });
      }
    }

    return collisions;
  }

  /**
   * Get dominant frequency
   */
  getDominantFrequency(frequencyData: Uint8Array): number {
    let maxValue = 0;
    let maxIndex = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }

    const nyquist = this.sampleRate / 2;
    const binWidth = nyquist / frequencyData.length;

    return maxIndex * binWidth;
  }

  /**
   * Calculate frequency band ratios
   */
  getFrequencyBalance(frequencyData: Uint8Array): {
    bassRatio: number;
    midsRatio: number;
    highsRatio: number;
  } {
    const bands = this.splitFrequencyBands(frequencyData);

    const bassEnergy = bands.subBass + bands.bass + bands.lowMids;
    const midsEnergy = bands.mids + bands.highMids;
    const highsEnergy = bands.presence + bands.brilliance;

    const totalEnergy = bassEnergy + midsEnergy + highsEnergy;

    if (totalEnergy === 0) {
      return { bassRatio: 0, midsRatio: 0, highsRatio: 0 };
    }

    return {
      bassRatio: bassEnergy / totalEnergy,
      midsRatio: midsEnergy / totalEnergy,
      highsRatio: highsEnergy / totalEnergy,
    };
  }

  /**
   * Suggest EQ adjustments based on frequency analysis
   */
  suggestEQAdjustments(
    currentFrequencyData: Uint8Array,
    targetBalance?: { bass: number; mids: number; highs: number }
  ): {
    low: number; // -12 to +12 dB
    mid: number;
    high: number;
    explanation: string;
  } {
    const balance = this.getFrequencyBalance(currentFrequencyData);
    const target = targetBalance || { bass: 0.4, mids: 0.35, highs: 0.25 };

    const bassDiff = target.bass - balance.bassRatio;
    const midsDiff = target.mids - balance.midsRatio;
    const highsDiff = target.highs - balance.highsRatio;

    // Convert to dB adjustments
    const lowAdjust = bassDiff * 12;
    const midAdjust = midsDiff * 12;
    const highAdjust = highsDiff * 12;

    let explanation = '';
    if (Math.abs(lowAdjust) > 2) {
      explanation += `Bass is ${lowAdjust > 0 ? 'too quiet' : 'too loud'}. `;
    }
    if (Math.abs(midAdjust) > 2) {
      explanation += `Mids are ${midAdjust > 0 ? 'lacking' : 'excessive'}. `;
    }
    if (Math.abs(highAdjust) > 2) {
      explanation += `Highs need ${highAdjust > 0 ? 'boosting' : 'cutting'}. `;
    }

    if (!explanation) {
      explanation = 'Frequency balance is good!';
    }

    return {
      low: Math.max(-12, Math.min(12, lowAdjust)),
      mid: Math.max(-12, Math.min(12, midAdjust)),
      high: Math.max(-12, Math.min(12, highAdjust)),
      explanation: explanation.trim(),
    };
  }
}

// Export singleton
export const frequencyAnalyzer = new FrequencyAnalyzer();
