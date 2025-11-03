/**
 * @fileOverview Comprehensive genre knowledge base for AI-enhanced DJing.
 * Contains BPM ranges, key characteristics, mixing techniques, and cultural context.
 */

export interface GenreInfo {
  name: string;
  bpmRange: { min: number; max: number; typical: number };
  commonKeys: string[];
  energyLevel: number; // 1-10
  characteristics: string[];
  mixingTips: string[];
  commonEffects: string[];
  culturalContext: string;
  subgenres: string[];
  iconicArtists: string[];
  compatibleGenres: string[];
}

export const GENRE_DATABASE: Record<string, GenreInfo> = {
  techno: {
    name: 'Techno',
    bpmRange: { min: 120, max: 150, typical: 130 },
    commonKeys: ['Am', 'Dm', 'Em', 'Gm', 'Cm'],
    energyLevel: 8,
    characteristics: [
      'Repetitive 4/4 beat',
      'Heavy use of synthesizers',
      'Minimal melodic elements',
      'Emphasis on rhythm and groove',
      'Industrial sounds and textures',
      'Long buildups and breakdowns',
    ],
    mixingTips: [
      'Use long blends (32-64 bars)',
      'Focus on EQ to create space',
      'Layer percussion elements',
      'Build energy gradually',
      'Use filters for dramatic transitions',
    ],
    commonEffects: ['Reverb', 'Delay', 'Filter', 'Distortion', 'Phaser'],
    culturalContext:
      'Born in Detroit in the 1980s, evolved into underground club culture worldwide. Known for hypnotic, driving rhythms.',
    subgenres: [
      'Minimal Techno',
      'Hard Techno',
      'Melodic Techno',
      'Industrial Techno',
      'Acid Techno',
      'Detroit Techno',
    ],
    iconicArtists: [
      'Carl Cox',
      'Richie Hawtin',
      'Adam Beyer',
      'Nina Kraviz',
      'Charlotte de Witte',
      'Amelie Lens',
    ],
    compatibleGenres: ['House', 'Trance', 'Industrial', 'Electro'],
  },

  house: {
    name: 'House',
    bpmRange: { min: 118, max: 135, typical: 125 },
    commonKeys: ['Am', 'C', 'Dm', 'F', 'G'],
    energyLevel: 7,
    characteristics: [
      'Four-on-the-floor beat',
      'Emphasis on groove and soul',
      'Soulful vocals or samples',
      'Funky basslines',
      'Piano and organ elements',
      'Uplifting atmosphere',
    ],
    mixingTips: [
      'Emphasize bassline swaps',
      'Use vocal acapellas for mashups',
      'Medium length transitions (16-32 bars)',
      'Keep the groove consistent',
      'Layer percussion tastefully',
    ],
    commonEffects: ['Echo', 'Reverb', 'Filter', 'Chorus', 'Flanger'],
    culturalContext:
      'Originated in Chicago in the early 1980s. Foundation of modern dance music, known for its inclusive, joyful spirit.',
    subgenres: [
      'Deep House',
      'Tech House',
      'Progressive House',
      'Tropical House',
      'Funky House',
      'Afro House',
    ],
    iconicArtists: [
      'Frankie Knuckles',
      'Larry Heard',
      'Kerri Chandler',
      'Black Coffee',
      'Dixon',
      'Jamie Jones',
    ],
    compatibleGenres: ['Techno', 'Disco', 'Funk', 'Soul', 'Garage'],
  },

  'drum-and-bass': {
    name: 'Drum & Bass',
    bpmRange: { min: 160, max: 180, typical: 174 },
    commonKeys: ['Am', 'Dm', 'Em', 'Bm', 'F#m'],
    energyLevel: 9,
    characteristics: [
      'Fast breakbeats',
      'Heavy sub-bass',
      'Complex drum patterns',
      'Jungle-influenced rhythms',
      'Atmospheric pads',
      'Chopped vocals',
    ],
    mixingTips: [
      'Quick cuts work well (8-16 bars)',
      'Double drops for impact',
      'Careful bass management',
      'Use breakdowns for transitions',
      'Loop drum sections',
    ],
    commonEffects: ['Reverb', 'Delay', 'Filter', 'Distortion', 'Ring Modulator'],
    culturalContext:
      'Emerged from UK rave scene in early 1990s. Known for high energy and technical production.',
    subgenres: [
      'Liquid DnB',
      'Neurofunk',
      'Jump Up',
      'Jungle',
      'Darkstep',
      'Techstep',
    ],
    iconicArtists: [
      'Goldie',
      'LTJ Bukem',
      'Andy C',
      'Noisia',
      'Calibre',
      'Chase & Status',
    ],
    compatibleGenres: ['Jungle', 'Dubstep', 'Breakbeat', 'Hardcore'],
  },

  trance: {
    name: 'Trance',
    bpmRange: { min: 125, max: 150, typical: 138 },
    commonKeys: ['C#m', 'Am', 'Em', 'Bm', 'F#m'],
    energyLevel: 8,
    characteristics: [
      'Euphoric melodies',
      'Long breakdowns and buildups',
      'Arpeggiated synths',
      'Emotional progression',
      'Layered pads',
      'Epic drops',
    ],
    mixingTips: [
      'Long mixes (64+ bars)',
      'Blend during breakdowns',
      'Match melodic keys',
      'Build energy through mashups',
      'Use extended intros/outros',
    ],
    commonEffects: ['Reverb', 'Delay', 'Phaser', 'Chorus', 'Gate'],
    culturalContext:
      'Developed in Germany in early 1990s. Known for euphoric, journey-like experiences.',
    subgenres: [
      'Progressive Trance',
      'Uplifting Trance',
      'Psytrance',
      'Tech Trance',
      'Vocal Trance',
      'Goa Trance',
    ],
    iconicArtists: [
      'Armin van Buuren',
      'Paul van Dyk',
      'Tiësto',
      'Above & Beyond',
      'Ferry Corsten',
      'Aly & Fila',
    ],
    compatibleGenres: ['Progressive House', 'Techno', 'Psytrance', 'Eurodance'],
  },

  dubstep: {
    name: 'Dubstep',
    bpmRange: { min: 130, max: 145, typical: 140 },
    commonKeys: ['Dm', 'Am', 'Em', 'F#m', 'C#m'],
    energyLevel: 9,
    characteristics: [
      'Half-time rhythm feel',
      'Massive sub-bass wobbles',
      'Syncopated drums',
      'Heavy drops',
      'Sparse arrangements',
      'Dark atmosphere',
    ],
    mixingTips: [
      'Double drops are essential',
      'Mix during sparse sections',
      'Quick transitions work well',
      'Match energy levels carefully',
      'Control bass frequencies',
    ],
    commonEffects: ['LFO', 'Filter', 'Distortion', 'Compression', 'Reverb'],
    culturalContext:
      'Born in South London early 2000s. Evolved from UK garage into bass music phenomenon.',
    subgenres: [
      'Brostep',
      'Riddim',
      'Deep Dubstep',
      'Melodic Dubstep',
      'Tearout',
      'Deathstep',
    ],
    iconicArtists: [
      'Skream',
      'Benga',
      'Excision',
      'Skrillex',
      'Mala',
      'Virtual Riot',
    ],
    compatibleGenres: ['Drum & Bass', 'Grime', 'Trap', 'Bass Music'],
  },

  'hip-hop': {
    name: 'Hip-Hop',
    bpmRange: { min: 60, max: 100, typical: 85 },
    commonKeys: ['Am', 'Cm', 'Dm', 'Em', 'Gm'],
    energyLevel: 6,
    characteristics: [
      'Boom-bap drums',
      'Sampled breaks',
      'Strong basslines',
      'Vocal emphasis',
      'Turntablism elements',
      'Rhythmic complexity',
    ],
    mixingTips: [
      'Quick cuts on beat 1',
      'Use acapellas extensively',
      'Scratch and juggle',
      'Backspin transitions',
      'Careful vocal mixing',
    ],
    commonEffects: ['Echo', 'Scratch', 'Filter', 'Transformer', 'Reverb'],
    culturalContext:
      'Emerged from Bronx, NYC in 1970s. Cultural movement encompassing music, dance, art.',
    subgenres: [
      'Trap',
      'Boom Bap',
      'Cloud Rap',
      'Drill',
      'G-Funk',
      'Underground Hip-Hop',
    ],
    iconicArtists: [
      'DJ Premier',
      'J Dilla',
      'Dr. Dre',
      'DJ Jazzy Jeff',
      'A-Trak',
      'DJ Shadow',
    ],
    compatibleGenres: ['R&B', 'Funk', 'Soul', 'Trap', 'Breakbeat'],
  },

  disco: {
    name: 'Disco',
    bpmRange: { min: 110, max: 130, typical: 120 },
    commonKeys: ['C', 'F', 'G', 'Dm', 'Am'],
    energyLevel: 7,
    characteristics: [
      'Four-on-the-floor beat',
      'Funky basslines',
      'String sections',
      'Lush arrangements',
      'Live instruments',
      'Uplifting vocals',
    ],
    mixingTips: [
      'Emphasize groove transitions',
      'Use edit points carefully',
      'Respect musical phrasing',
      'Layer strings and horns',
      'Smooth crossfader work',
    ],
    commonEffects: ['Echo', 'Phaser', 'Flanger', 'Reverb', 'Chorus'],
    culturalContext:
      '1970s dance music phenomenon. Foundation of modern club culture and electronic music.',
    subgenres: [
      'Nu-Disco',
      'Italo Disco',
      'Euro Disco',
      'Cosmic Disco',
      'Boogie',
    ],
    iconicArtists: [
      'Chic',
      'Donna Summer',
      'Giorgio Moroder',
      'Cerrone',
      'Sylvester',
      'Earth Wind & Fire',
    ],
    compatibleGenres: ['Funk', 'House', 'Boogie', 'Soul', 'Nu-Disco'],
  },

  ambient: {
    name: 'Ambient',
    bpmRange: { min: 60, max: 90, typical: 75 },
    commonKeys: ['C', 'Am', 'F', 'G', 'Dm'],
    energyLevel: 2,
    characteristics: [
      'Atmospheric textures',
      'Minimal rhythm',
      'Emphasis on tone and mood',
      'Long evolving pads',
      'Environmental sounds',
      'Meditative quality',
    ],
    mixingTips: [
      'Very long blends',
      'Focus on harmonic matching',
      'Minimal percussion',
      'Use silence effectively',
      'Gradual textural shifts',
    ],
    commonEffects: ['Reverb', 'Delay', 'Granular', 'Shimmer', 'Chorus'],
    culturalContext:
      'Pioneered by Brian Eno in 1970s. Music as atmosphere and environmental sound.',
    subgenres: [
      'Dark Ambient',
      'Dub Ambient',
      'Space Ambient',
      'Drone',
      'Ambient Techno',
    ],
    iconicArtists: [
      'Brian Eno',
      'Aphex Twin',
      'Biosphere',
      'The Orb',
      'Stars of the Lid',
      'Tim Hecker',
    ],
    compatibleGenres: ['Downtempo', 'Drone', 'Experimental', 'Chillout'],
  },
};

/**
 * Get genre information by name
 */
export function getGenreInfo(genre: string): GenreInfo | undefined {
  const normalized = genre.toLowerCase().replace(/\s+/g, '-');
  return GENRE_DATABASE[normalized];
}

/**
 * Find compatible genres for mixing
 */
export function getCompatibleGenres(genre: string): string[] {
  const info = getGenreInfo(genre);
  return info?.compatibleGenres || [];
}

/**
 * Get BPM range for a genre
 */
export function getGenreBPMRange(
  genre: string
): { min: number; max: number; typical: number } | undefined {
  const info = getGenreInfo(genre);
  return info?.bpmRange;
}

/**
 * Check if two genres are compatible for mixing
 */
export function areGenresCompatible(genre1: string, genre2: string): boolean {
  const info1 = getGenreInfo(genre1);
  if (!info1) return false;

  return info1.compatibleGenres.some(
    (g) => g.toLowerCase() === genre2.toLowerCase()
  );
}

/**
 * Get all available genres
 */
export function getAllGenres(): string[] {
  return Object.keys(GENRE_DATABASE);
}

/**
 * Format genre information as context for AI prompts
 */
export function formatGenreContext(genres: string[]): string {
  const genreInfos = genres
    .map(getGenreInfo)
    .filter((info): info is GenreInfo => info !== undefined);

  if (genreInfos.length === 0) return '';

  return genreInfos
    .map(
      (info) => `
**${info.name}**:
- BPM: ${info.bpmRange.min}-${info.bpmRange.max} (typical: ${info.bpmRange.typical})
- Energy: ${info.energyLevel}/10
- Common Keys: ${info.commonKeys.join(', ')}
- Characteristics: ${info.characteristics.join(', ')}
- Mixing Tips: ${info.mixingTips.join('; ')}
- Compatible with: ${info.compatibleGenres.join(', ')}
`
    )
    .join('\n');
}
