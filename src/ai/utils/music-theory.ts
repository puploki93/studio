/**
 * @fileOverview Music theory utilities for DJing - BPM compatibility, key matching, Camelot wheel.
 */

/**
 * Camelot Wheel mapping for harmonic mixing
 * Maps musical keys to Camelot codes
 */
export const CAMELOT_WHEEL: Record<
  string,
  { code: string; compatible: string[]; energy: 'up' | 'down' | 'same'[] }
> = {
  // Major keys (B side)
  'C': {
    code: '8B',
    compatible: ['8B', '8A', '7B', '9B'], // Same, relative minor, ±1
    energy: ['same', 'down', 'same', 'same'],
  },
  'Db': { code: '3B', compatible: ['3B', '3A', '2B', '4B'], energy: ['same', 'down', 'same', 'same'] },
  'D': { code: '10B', compatible: ['10B', '10A', '9B', '11B'], energy: ['same', 'down', 'same', 'same'] },
  'Eb': { code: '5B', compatible: ['5B', '5A', '4B', '6B'], energy: ['same', 'down', 'same', 'same'] },
  'E': { code: '12B', compatible: ['12B', '12A', '11B', '1B'], energy: ['same', 'down', 'same', 'same'] },
  'F': { code: '7B', compatible: ['7B', '7A', '6B', '8B'], energy: ['same', 'down', 'same', 'same'] },
  'F#': { code: '2B', compatible: ['2B', '2A', '1B', '3B'], energy: ['same', 'down', 'same', 'same'] },
  'G': { code: '9B', compatible: ['9B', '9A', '8B', '10B'], energy: ['same', 'down', 'same', 'same'] },
  'Ab': { code: '4B', compatible: ['4B', '4A', '3B', '5B'], energy: ['same', 'down', 'same', 'same'] },
  'A': { code: '11B', compatible: ['11B', '11A', '10B', '12B'], energy: ['same', 'down', 'same', 'same'] },
  'Bb': { code: '6B', compatible: ['6B', '6A', '5B', '7B'], energy: ['same', 'down', 'same', 'same'] },
  'B': { code: '1B', compatible: ['1B', '1A', '12B', '2B'], energy: ['same', 'down', 'same', 'same'] },

  // Minor keys (A side)
  'Am': { code: '8A', compatible: ['8A', '8B', '7A', '9A'], energy: ['same', 'up', 'same', 'same'] },
  'Bbm': { code: '3A', compatible: ['3A', '3B', '2A', '4A'], energy: ['same', 'up', 'same', 'same'] },
  'Bm': { code: '10A', compatible: ['10A', '10B', '9A', '11A'], energy: ['same', 'up', 'same', 'same'] },
  'Cm': { code: '5A', compatible: ['5A', '5B', '4A', '6A'], energy: ['same', 'up', 'same', 'same'] },
  'C#m': { code: '12A', compatible: ['12A', '12B', '11A', '1A'], energy: ['same', 'up', 'same', 'same'] },
  'Dm': { code: '7A', compatible: ['7A', '7B', '6A', '8A'], energy: ['same', 'up', 'same', 'same'] },
  'Ebm': { code: '2A', compatible: ['2A', '2B', '1A', '3A'], energy: ['same', 'up', 'same', 'same'] },
  'Em': { code: '9A', compatible: ['9A', '9B', '8A', '10A'], energy: ['same', 'up', 'same', 'same'] },
  'Fm': { code: '4A', compatible: ['4A', '4B', '3A', '5A'], energy: ['same', 'up', 'same', 'same'] },
  'F#m': { code: '11A', compatible: ['11A', '11B', '10A', '12A'], energy: ['same', 'up', 'same', 'same'] },
  'Gm': { code: '6A', compatible: ['6A', '6B', '5A', '7A'], energy: ['same', 'up', 'same', 'same'] },
  'G#m': { code: '1A', compatible: ['1A', '1B', '12A', '2A'], energy: ['same', 'up', 'same', 'same'] },
};

/**
 * Check if two keys are compatible for harmonic mixing
 */
export function areKeysCompatible(key1: string, key2: string): {
  compatible: boolean;
  relationship: string;
  advice: string;
} {
  const info1 = CAMELOT_WHEEL[key1];
  const info2 = CAMELOT_WHEEL[key2];

  if (!info1 || !info2) {
    return {
      compatible: false,
      relationship: 'unknown',
      advice: 'One or both keys not recognized',
    };
  }

  if (info1.code === info2.code) {
    return {
      compatible: true,
      relationship: 'perfect match',
      advice: 'Same key - perfectly harmonic. Mix freely!',
    };
  }

  if (info1.compatible.includes(info2.code)) {
    const index = info1.compatible.indexOf(info2.code);
    const relationships = [
      'same key',
      'relative major/minor',
      'energy step down',
      'energy step up',
    ];
    return {
      compatible: true,
      relationship: relationships[index] || 'compatible',
      advice: `Compatible keys (${info1.code} → ${info2.code}). ${
        index === 1
          ? 'Moving to relative key - smooth transition'
          : index === 2
          ? 'Stepping down in energy'
          : index === 3
          ? 'Stepping up in energy'
          : 'Perfect harmonic match'
      }`,
    };
  }

  return {
    compatible: false,
    relationship: 'not harmonically compatible',
    advice: `Keys clash (${info1.code} vs ${info2.code}). Consider mixing during breakdown or use key shift.`,
  };
}

/**
 * Get Camelot code for a musical key
 */
export function getCamelotCode(key: string): string | undefined {
  return CAMELOT_WHEEL[key]?.code;
}

/**
 * Calculate BPM compatibility between two tracks
 */
export function calculateBPMCompatibility(bpm1: number, bpm2: number): {
  compatible: boolean;
  percentageDiff: number;
  pitchAdjustment: number;
  advice: string;
} {
  const diff = Math.abs(bpm1 - bpm2);
  const percentageDiff = (diff / bpm1) * 100;
  const pitchAdjustment = ((bpm2 - bpm1) / bpm1) * 100;

  if (percentageDiff === 0) {
    return {
      compatible: true,
      percentageDiff: 0,
      pitchAdjustment: 0,
      advice: 'Perfect BPM match - sync and play!',
    };
  }

  if (percentageDiff <= 6) {
    return {
      compatible: true,
      percentageDiff: Math.round(percentageDiff * 10) / 10,
      pitchAdjustment: Math.round(pitchAdjustment * 10) / 10,
      advice: `Excellent compatibility. Adjust pitch by ${
        pitchAdjustment > 0 ? '+' : ''
      }${Math.round(pitchAdjustment * 10) / 10}%`,
    };
  }

  if (percentageDiff <= 10) {
    return {
      compatible: true,
      percentageDiff: Math.round(percentageDiff * 10) / 10,
      pitchAdjustment: Math.round(pitchAdjustment * 10) / 10,
      advice: `Acceptable but noticeable pitch change (${
        pitchAdjustment > 0 ? '+' : ''
      }${Math.round(pitchAdjustment * 10) / 10}%). May sound unnatural.`,
    };
  }

  // Check if double/half time relationship
  const ratio = bpm2 / bpm1;
  if (Math.abs(ratio - 2.0) < 0.1 || Math.abs(ratio - 0.5) < 0.1) {
    return {
      compatible: true,
      percentageDiff: Math.round(percentageDiff * 10) / 10,
      pitchAdjustment: 0,
      advice: 'Double/half time relationship - creative opportunity! Mix at breakdown.',
    };
  }

  return {
    compatible: false,
    percentageDiff: Math.round(percentageDiff * 10) / 10,
    pitchAdjustment: Math.round(pitchAdjustment * 10) / 10,
    advice: `BPM difference too large (${Math.round(
      percentageDiff
    )}%). Mix during breakdown or use creative transition.`,
  };
}

/**
 * Find the optimal sync BPM between two tracks
 */
export function findOptimalSyncBPM(bpm1: number, bpm2: number): {
  syncBPM: number;
  track1Adjustment: number;
  track2Adjustment: number;
  advice: string;
} {
  const avgBPM = (bpm1 + bpm2) / 2;
  const track1Adj = ((avgBPM - bpm1) / bpm1) * 100;
  const track2Adj = ((avgBPM - bpm2) / bpm2) * 100;

  return {
    syncBPM: Math.round(avgBPM * 10) / 10,
    track1Adjustment: Math.round(track1Adj * 10) / 10,
    track2Adjustment: Math.round(track2Adj * 10) / 10,
    advice: `Sync at ${Math.round(avgBPM)} BPM. Track 1: ${
      track1Adj > 0 ? '+' : ''
    }${Math.round(track1Adj * 10) / 10}%, Track 2: ${track2Adj > 0 ? '+' : ''}${
      Math.round(track2Adj * 10) / 10
    }%`,
  };
}

/**
 * Estimate BPM from genre
 */
export function estimateBPMFromGenre(genre: string): {
  min: number;
  max: number;
  typical: number;
} {
  const genreBPMs: Record<string, { min: number; max: number; typical: number }> = {
    techno: { min: 120, max: 150, typical: 130 },
    house: { min: 118, max: 135, typical: 125 },
    'drum-and-bass': { min: 160, max: 180, typical: 174 },
    trance: { min: 125, max: 150, typical: 138 },
    dubstep: { min: 130, max: 145, typical: 140 },
    'hip-hop': { min: 60, max: 100, typical: 85 },
    trap: { min: 70, max: 90, typical: 75 },
    disco: { min: 110, max: 130, typical: 120 },
    ambient: { min: 60, max: 90, typical: 75 },
  };

  const normalized = genre.toLowerCase().replace(/\s+/g, '-');
  return genreBPMs[normalized] || { min: 100, max: 140, typical: 120 };
}

/**
 * Estimate musical key from track characteristics
 */
export function estimateKeyFromCharacteristics(characteristics: {
  mood: 'dark' | 'bright' | 'neutral';
  genre: string;
}): string[] {
  const { mood, genre } = characteristics;

  // Minor keys (darker)
  const minorKeys = ['Am', 'Dm', 'Em', 'Bm', 'F#m', 'Cm', 'Gm'];
  // Major keys (brighter)
  const majorKeys = ['C', 'F', 'G', 'D', 'A', 'E', 'Bb'];

  const genreLower = genre.toLowerCase();

  // Techno/darker genres favor minor keys
  if (
    genreLower.includes('techno') ||
    genreLower.includes('dark') ||
    mood === 'dark'
  ) {
    return minorKeys.slice(0, 5);
  }

  // House/disco favor major keys
  if (
    genreLower.includes('house') ||
    genreLower.includes('disco') ||
    mood === 'bright'
  ) {
    return majorKeys.slice(0, 5);
  }

  // Neutral - mix of both
  return [...minorKeys.slice(0, 3), ...majorKeys.slice(0, 3)];
}

/**
 * Get next compatible key for energy progression
 */
export function getNextKeyForEnergyShift(
  currentKey: string,
  direction: 'up' | 'down' | 'same'
): string[] {
  const info = CAMELOT_WHEEL[currentKey];
  if (!info) return [];

  const compatible = info.compatible;

  if (direction === 'same') {
    return [currentKey];
  }

  if (direction === 'up') {
    // Move to relative major or +1 on wheel
    return compatible.filter((_, idx) => idx === 1 || idx === 3);
  }

  // direction === 'down'
  // Move to relative minor or -1 on wheel
  return compatible.filter((_, idx) => idx === 1 || idx === 2);
}
