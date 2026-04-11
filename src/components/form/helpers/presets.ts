export type PresetChord = {
  interval: number;      // semitones from key root
  quality: string;       // display name
  intervals: number[];   // chord tone intervals for chordToForm
};

export type Preset = {
  name: string;
  artist?: string;
  category: 'foundational' | 'song';
  defaultKey: number;    // root note index 0-11
  chords: PresetChord[];
};

const MAJ: number[] = [0, 4, 7];
const MIN: number[] = [0, 3, 7];
const DOM7: number[] = [0, 4, 7, 10];
const MAJ7: number[] = [0, 4, 7, 11];
const MIN7: number[] = [0, 3, 7, 10];
const MIN7B5: number[] = [0, 3, 6, 10];
const DIM7: number[] = [0, 3, 6, 9];

export const presets: Preset[] = [
  // ── Foundational ──
  {
    name: 'I \u2013 IV \u2013 V',
    category: 'foundational',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 5, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'I \u2013 V \u2013 vi \u2013 IV',
    category: 'foundational',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
      { interval: 9, quality: 'Min', intervals: MIN },
      { interval: 5, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'ii \u2013 V \u2013 I',
    category: 'foundational',
    defaultKey: 0,
    chords: [
      { interval: 2, quality: 'Min7', intervals: MIN7 },
      { interval: 7, quality: '7', intervals: DOM7 },
      { interval: 0, quality: 'Maj7', intervals: MAJ7 },
    ],
  },
  {
    name: 'I \u2013 vi \u2013 IV \u2013 V',
    category: 'foundational',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 9, quality: 'Min', intervals: MIN },
      { interval: 5, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'Blues (I7 \u2013 IV7 \u2013 V7)',
    category: 'foundational',
    defaultKey: 9,
    chords: [
      { interval: 0, quality: '7', intervals: DOM7 },
      { interval: 5, quality: '7', intervals: DOM7 },
      { interval: 7, quality: '7', intervals: DOM7 },
    ],
  },
  {
    name: 'Jazz Blues',
    category: 'foundational',
    defaultKey: 5,
    chords: [
      { interval: 0, quality: '7', intervals: DOM7 },
      { interval: 5, quality: '7', intervals: DOM7 },
      { interval: 7, quality: 'Min7', intervals: MIN7 },
      { interval: 6, quality: 'Dim7', intervals: DIM7 },
      { interval: 4, quality: 'Min7', intervals: MIN7 },
      { interval: 9, quality: '7', intervals: DOM7 },
      { interval: 2, quality: 'Min7', intervals: MIN7 },
      { interval: 7, quality: '7', intervals: DOM7 },
    ],
  },
  {
    name: 'i \u2013 VII \u2013 VI',
    category: 'foundational',
    defaultKey: 9,
    chords: [
      { interval: 0, quality: 'Min', intervals: MIN },
      { interval: 10, quality: 'Maj', intervals: MAJ },
      { interval: 8, quality: 'Maj', intervals: MAJ },
    ],
  },

  // ── Songs ──
  {
    name: 'Let It Be',
    artist: 'The Beatles',
    category: 'song',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
      { interval: 9, quality: 'Min', intervals: MIN },
      { interval: 5, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'Stand By Me',
    artist: 'Ben E. King',
    category: 'song',
    defaultKey: 9,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 9, quality: 'Min', intervals: MIN },
      { interval: 5, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'Autumn Leaves',
    category: 'song',
    defaultKey: 10,
    chords: [
      { interval: 2, quality: 'Min7', intervals: MIN7 },
      { interval: 7, quality: '7', intervals: DOM7 },
      { interval: 0, quality: 'Maj7', intervals: MAJ7 },
      { interval: 5, quality: 'Maj7', intervals: MAJ7 },
      { interval: 11, quality: 'Min7b5', intervals: MIN7B5 },
      { interval: 4, quality: '7', intervals: DOM7 },
      { interval: 9, quality: 'Min', intervals: MIN },
    ],
  },
  {
    name: 'Hallelujah',
    artist: 'Leonard Cohen',
    category: 'song',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 9, quality: 'Min', intervals: MIN },
      { interval: 5, quality: 'Maj', intervals: MAJ },
      { interval: 7, quality: 'Maj', intervals: MAJ },
    ],
  },
  {
    name: 'Creep',
    artist: 'Radiohead',
    category: 'song',
    defaultKey: 7,
    chords: [
      { interval: 0, quality: 'Maj', intervals: MAJ },
      { interval: 4, quality: 'Maj', intervals: MAJ },
      { interval: 5, quality: 'Maj', intervals: MAJ },
      { interval: 5, quality: 'Min', intervals: MIN },
    ],
  },
  {
    name: 'Blue Bossa',
    artist: 'Kenny Dorham',
    category: 'song',
    defaultKey: 0,
    chords: [
      { interval: 0, quality: 'Min7', intervals: MIN7 },
      { interval: 5, quality: 'Min7', intervals: MIN7 },
      { interval: 2, quality: 'Min7b5', intervals: MIN7B5 },
      { interval: 7, quality: '7', intervals: DOM7 },
      { interval: 3, quality: 'Min7', intervals: MIN7 },
      { interval: 8, quality: '7', intervals: DOM7 },
      { interval: 1, quality: 'Maj7', intervals: MAJ7 },
    ],
  },
  {
    name: 'Fly Me to the Moon',
    artist: 'Bart Howard',
    category: 'song',
    defaultKey: 0,
    chords: [
      { interval: 9, quality: 'Min7', intervals: MIN7 },
      { interval: 2, quality: 'Min7', intervals: MIN7 },
      { interval: 7, quality: '7', intervals: DOM7 },
      { interval: 0, quality: 'Maj7', intervals: MAJ7 },
      { interval: 5, quality: 'Maj7', intervals: MAJ7 },
      { interval: 11, quality: 'Min7b5', intervals: MIN7B5 },
      { interval: 4, quality: '7', intervals: DOM7 },
      { interval: 9, quality: 'Min', intervals: MIN },
    ],
  },
];
