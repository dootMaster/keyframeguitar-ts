export type Quality = { name: string; intervals: number[] };
export type Section = { label: string; items: Quality[] };

export type ScaleChord = {
  degree: string;
  interval: number;      // semitones from scale root
  quality: string;
  chordIntervals: number[];
};

export type ScaleSection = {
  label: string;
  chords: ScaleChord[];
  modes: Quality[];
};

export const sections: Section[] = [
  { label: 'Triads', items: [
    { name: 'Maj', intervals: [0, 4, 7] },
    { name: 'Min', intervals: [0, 3, 7] },
    { name: 'Dim', intervals: [0, 3, 6] },
    { name: 'Aug', intervals: [0, 4, 8] },
    { name: 'Sus2', intervals: [0, 2, 7] },
    { name: 'Sus4', intervals: [0, 5, 7] },
    { name: '5', intervals: [0, 7] },
  ]},
  { label: 'Sevenths', items: [
    { name: '7', intervals: [0, 4, 7, 10] },
    { name: 'Maj7', intervals: [0, 4, 7, 11] },
    { name: 'Min7', intervals: [0, 3, 7, 10] },
    { name: 'Dim7', intervals: [0, 3, 6, 9] },
    { name: 'Min7b5', intervals: [0, 3, 6, 10] },
    { name: 'mMaj7', intervals: [0, 3, 7, 11] },
    { name: 'Aug7', intervals: [0, 4, 8, 10] },
    { name: '7Sus4', intervals: [0, 5, 7, 10] },
  ]},
  { label: 'Extended', items: [
    { name: '6', intervals: [0, 4, 7, 9] },
    { name: 'Min6', intervals: [0, 3, 7, 9] },
    { name: '9', intervals: [0, 2, 4, 7, 10] },
    { name: 'Maj9', intervals: [0, 2, 4, 7, 11] },
    { name: 'Min9', intervals: [0, 2, 3, 7, 10] },
    { name: 'Add9', intervals: [0, 2, 4, 7] },
    { name: '6/9', intervals: [0, 2, 4, 7, 9] },
    { name: '11', intervals: [0, 2, 4, 5, 7, 10] },
    { name: 'Min11', intervals: [0, 2, 3, 5, 7, 10] },
    { name: 'Maj11', intervals: [0, 2, 4, 5, 7, 11] },
    { name: '13', intervals: [0, 2, 4, 7, 9, 10] },
    { name: 'Maj13', intervals: [0, 2, 4, 7, 9, 11] },
    { name: 'Min13', intervals: [0, 2, 3, 7, 9, 10] },
  ]},
  { label: 'Altered', items: [
    { name: '7b9', intervals: [0, 1, 4, 7, 10] },
    { name: '7#9', intervals: [0, 3, 4, 7, 10] },
    { name: '7b5', intervals: [0, 4, 6, 10] },
    { name: '7#5', intervals: [0, 4, 8, 10] },
    { name: '7b9b5', intervals: [0, 1, 4, 6, 10] },
    { name: '7#9b5', intervals: [0, 3, 4, 6, 10] },
    { name: '7Alt', intervals: [0, 1, 3, 4, 6, 8, 10] },
    { name: 'Add11', intervals: [0, 4, 5, 7] },
    { name: 'Maj7#11', intervals: [0, 4, 6, 7, 11] },
  ]},
  { label: 'Pentatonic / Blues', items: [
    { name: 'Maj Pent', intervals: [0, 2, 4, 7, 9] },
    { name: 'Min Pent', intervals: [0, 3, 5, 7, 10] },
    { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
    { name: 'Maj Blues', intervals: [0, 2, 3, 4, 7, 9] },
  ]},
];

export const scaleSections: ScaleSection[] = [
  {
    label: 'Major Scale',
    chords: [
      { degree: 'I',    interval: 0,  quality: 'Maj7',   chordIntervals: [0, 4, 7, 11] },
      { degree: 'ii',   interval: 2,  quality: 'Min7',   chordIntervals: [0, 3, 7, 10] },
      { degree: 'iii',  interval: 4,  quality: 'Min7',   chordIntervals: [0, 3, 7, 10] },
      { degree: 'IV',   interval: 5,  quality: 'Maj7',   chordIntervals: [0, 4, 7, 11] },
      { degree: 'V',    interval: 7,  quality: '7',      chordIntervals: [0, 4, 7, 10] },
      { degree: 'vi',   interval: 9,  quality: 'Min7',   chordIntervals: [0, 3, 7, 10] },
      { degree: 'vii°', interval: 11, quality: 'Min7b5', chordIntervals: [0, 3, 6, 10] },
    ],
    modes: [
      { name: 'Ionian', intervals: [0, 2, 4, 5, 7, 9, 11] },
      { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
      { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
      { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
      { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
      { name: 'Aeolian', intervals: [0, 2, 3, 5, 7, 8, 10] },
      { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
    ],
  },
  {
    label: 'Melodic Minor',
    chords: [
      { degree: 'i',     interval: 0,  quality: 'mMaj7',  chordIntervals: [0, 3, 7, 11] },
      { degree: 'ii',    interval: 2,  quality: 'Min7',   chordIntervals: [0, 3, 7, 10] },
      { degree: 'bIII+', interval: 3,  quality: 'Maj7#5', chordIntervals: [0, 4, 8, 11] },
      { degree: 'IV',    interval: 5,  quality: '7',      chordIntervals: [0, 4, 7, 10] },
      { degree: 'V',     interval: 7,  quality: '7',      chordIntervals: [0, 4, 7, 10] },
      { degree: 'vi',    interval: 9,  quality: 'Min7b5', chordIntervals: [0, 3, 6, 10] },
      { degree: 'vii',   interval: 11, quality: 'Min7b5', chordIntervals: [0, 3, 6, 10] },
    ],
    modes: [
      { name: 'Mel Min', intervals: [0, 2, 3, 5, 7, 9, 11] },
      { name: 'Dorian b2', intervals: [0, 1, 3, 5, 7, 9, 10] },
      { name: 'Lydian Aug', intervals: [0, 2, 4, 6, 8, 9, 11] },
      { name: 'Lydian Dom', intervals: [0, 2, 4, 6, 7, 9, 10] },
      { name: 'Mixo b6', intervals: [0, 2, 4, 5, 7, 8, 10] },
      { name: 'Locrian #2', intervals: [0, 2, 3, 5, 6, 8, 10] },
      { name: 'Altered', intervals: [0, 1, 3, 4, 6, 8, 10] },
    ],
  },
  {
    label: 'Harmonic Minor',
    chords: [
      { degree: 'i',     interval: 0,  quality: 'mMaj7',  chordIntervals: [0, 3, 7, 11] },
      { degree: 'ii°',   interval: 2,  quality: 'Min7b5', chordIntervals: [0, 3, 6, 10] },
      { degree: 'bIII+', interval: 3,  quality: 'Maj7#5', chordIntervals: [0, 4, 8, 11] },
      { degree: 'iv',    interval: 5,  quality: 'Min7',   chordIntervals: [0, 3, 7, 10] },
      { degree: 'V',     interval: 7,  quality: '7',      chordIntervals: [0, 4, 7, 10] },
      { degree: 'bVI',   interval: 8,  quality: 'Maj7',   chordIntervals: [0, 4, 7, 11] },
      { degree: 'vii°',  interval: 11, quality: 'Dim7',   chordIntervals: [0, 3, 6, 9] },
    ],
    modes: [
      { name: 'Harm Min', intervals: [0, 2, 3, 5, 7, 8, 11] },
      { name: 'Locrian #6', intervals: [0, 1, 3, 5, 6, 9, 10] },
      { name: 'Ionian #5', intervals: [0, 2, 4, 5, 8, 9, 11] },
      { name: 'Dorian #4', intervals: [0, 2, 3, 6, 7, 9, 10] },
      { name: 'Phryg Dom', intervals: [0, 1, 4, 5, 7, 8, 10] },
      { name: 'Lydian #2', intervals: [0, 3, 4, 6, 7, 9, 11] },
      { name: 'Ultra Locrian', intervals: [0, 1, 3, 4, 6, 8, 9] },
    ],
  },
];

export const allQualities = sections.flatMap(s => s.items);

export function chordToForm(root: number, intervals: number[]): boolean[] {
  const form = new Array(12).fill(false);
  intervals.forEach(interval => {
    form[(root + interval) % 12] = true;
  });
  return form;
}
