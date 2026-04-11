import {
  chordToForm,
  parseChordName,
  parseChordInfo,
  chordDegreeMap,
  guideToneMask,
  sections,
  scaleSections,
  allQualities,
} from '../chords';

// ---------------------------------------------------------------------------
// chordToForm
// ---------------------------------------------------------------------------
describe('chordToForm', () => {
  it('returns an array of exactly 12 booleans', () => {
    const form = chordToForm(0, [0, 4, 7]);
    expect(form).toHaveLength(12);
    form.forEach(v => expect(typeof v).toBe('boolean'));
  });

  it('marks the correct indices for C Maj (root=0, intervals=[0,4,7])', () => {
    const form = chordToForm(0, [0, 4, 7]);
    expect(form[0]).toBe(true);  // C  (root)
    expect(form[4]).toBe(true);  // E  (major 3rd)
    expect(form[7]).toBe(true);  // G  (perfect 5th)
    // all other indices should be false
    [1, 2, 3, 5, 6, 8, 9, 10, 11].forEach(i => {
      expect(form[i]).toBe(false);
    });
  });

  it('handles G Maj (root=7, intervals=[0,4,7])', () => {
    const form = chordToForm(7, [0, 4, 7]);
    expect(form[7]).toBe(true);   // G  (root)
    expect(form[11]).toBe(true);  // B  (major 3rd at 7+4)
    expect(form[2]).toBe(true);   // D  (perfect 5th at (7+7)%12)
    const trueCount = form.filter(Boolean).length;
    expect(trueCount).toBe(3);
  });

  it('wraps correctly past index 11 (Bb Min: root=10, intervals=[0,3,7])', () => {
    const form = chordToForm(10, [0, 3, 7]);
    expect(form[10]).toBe(true);  // Bb (root)
    expect(form[1]).toBe(true);   // Db (minor 3rd at (10+3)%12)
    expect(form[5]).toBe(true);   // F  (perfect 5th at (10+7)%12)
    const trueCount = form.filter(Boolean).length;
    expect(trueCount).toBe(3);
  });

  it('handles an empty intervals array', () => {
    const form = chordToForm(0, []);
    expect(form).toHaveLength(12);
    expect(form.every(v => v === false)).toBe(true);
  });

  it('handles a power chord (root=0, intervals=[0,7])', () => {
    const form = chordToForm(0, [0, 7]);
    const trueCount = form.filter(Boolean).length;
    expect(trueCount).toBe(2);
    expect(form[0]).toBe(true);
    expect(form[7]).toBe(true);
  });

  it('handles extended chords with many intervals (C 9: [0,2,4,7,10])', () => {
    const form = chordToForm(0, [0, 2, 4, 7, 10]);
    expect(form[0]).toBe(true);
    expect(form[2]).toBe(true);
    expect(form[4]).toBe(true);
    expect(form[7]).toBe(true);
    expect(form[10]).toBe(true);
    const trueCount = form.filter(Boolean).length;
    expect(trueCount).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// parseChordName
// ---------------------------------------------------------------------------
describe('parseChordName', () => {
  it('parses "C Maj" into a name and a correct form', () => {
    const result = parseChordName('C Maj');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('C Maj');
    expect(result!.form).toHaveLength(12);
    expect(result!.form[0]).toBe(true);  // C
    expect(result!.form[4]).toBe(true);  // E
    expect(result!.form[7]).toBe(true);  // G
  });

  it('parses "Db Maj7" correctly', () => {
    const result = parseChordName('Db Maj7');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Db Maj7');
    // Db=1, Maj7=[0,4,7,11] => indices 1,5,8,0
    expect(result!.form[1]).toBe(true);   // Db
    expect(result!.form[5]).toBe(true);   // F
    expect(result!.form[8]).toBe(true);   // Ab
    expect(result!.form[0]).toBe(true);   // C (major 7th)
  });

  it('parses sharp root names like "C# Min7"', () => {
    const result = parseChordName('C# Min7');
    expect(result).not.toBeNull();
    // C#=1, Min7=[0,3,7,10] => indices 1,4,8,11
    expect(result!.form[1]).toBe(true);
    expect(result!.form[4]).toBe(true);
    expect(result!.form[8]).toBe(true);
    expect(result!.form[11]).toBe(true);
  });

  it('returns null for an invalid root note', () => {
    expect(parseChordName('X Maj')).toBeNull();
  });

  it('returns null for an invalid quality', () => {
    expect(parseChordName('C FakeChord')).toBeNull();
  });

  it('returns null when there is no space in the name', () => {
    expect(parseChordName('CMaj')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseChordName('')).toBeNull();
  });

  it('parses all flat root names successfully with Maj', () => {
    const flatRoots = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    flatRoots.forEach(root => {
      const result = parseChordName(`${root} Maj`);
      expect(result).not.toBeNull();
      expect(result!.name).toBe(`${root} Maj`);
    });
  });

  it('parses all sharp root names successfully with Maj', () => {
    const sharpRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    sharpRoots.forEach(root => {
      const result = parseChordName(`${root} Maj`);
      expect(result).not.toBeNull();
      expect(result!.name).toBe(`${root} Maj`);
    });
  });
});

// ---------------------------------------------------------------------------
// parseChordInfo
// ---------------------------------------------------------------------------
describe('parseChordInfo', () => {
  it('parses "C Min7" into root=0 and intervals=[0,3,7,10]', () => {
    const result = parseChordInfo('C Min7');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(0);
    expect(result!.intervals).toEqual([0, 3, 7, 10]);
  });

  it('parses "G Maj" into root=7 and intervals=[0,4,7]', () => {
    const result = parseChordInfo('G Maj');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(7);
    expect(result!.intervals).toEqual([0, 4, 7]);
  });

  it('parses "F# Dim7" into root=6 and intervals=[0,3,6,9]', () => {
    const result = parseChordInfo('F# Dim7');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(6);
    expect(result!.intervals).toEqual([0, 3, 6, 9]);
  });

  it('parses "Bb 7" into root=10 and intervals=[0,4,7,10]', () => {
    const result = parseChordInfo('Bb 7');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(10);
    expect(result!.intervals).toEqual([0, 4, 7, 10]);
  });

  it('returns null for an invalid root', () => {
    expect(parseChordInfo('Z Maj')).toBeNull();
  });

  it('returns null for an invalid quality', () => {
    expect(parseChordInfo('C NonExistent')).toBeNull();
  });

  it('returns null when no space is present', () => {
    expect(parseChordInfo('CMaj7')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseChordInfo('')).toBeNull();
  });

  it('recognizes mode names from scaleSections (e.g., "C Ionian")', () => {
    const result = parseChordInfo('C Ionian');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(0);
    expect(result!.intervals).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('recognizes harmonic minor modes (e.g., "A Harm Min")', () => {
    const result = parseChordInfo('A Harm Min');
    expect(result).not.toBeNull();
    expect(result!.root).toBe(9);
    expect(result!.intervals).toEqual([0, 2, 3, 5, 7, 8, 11]);
  });
});

// ---------------------------------------------------------------------------
// chordDegreeMap
// ---------------------------------------------------------------------------
describe('chordDegreeMap', () => {
  it('returns an array of 12 elements', () => {
    const map = chordDegreeMap(0, [0, 4, 7]);
    expect(map).toHaveLength(12);
  });

  it('maps C Maj (root=0, [0,4,7]) correctly: 0->R, 4->3, 7->5', () => {
    const map = chordDegreeMap(0, [0, 4, 7]);
    expect(map[0]).toBe('R');
    expect(map[4]).toBe('3');
    expect(map[7]).toBe('5');
    // non-chord tones should be null
    [1, 2, 3, 5, 6, 8, 9, 10, 11].forEach(i => {
      expect(map[i]).toBeNull();
    });
  });

  it('maps C Min7 (root=0, [0,3,7,10]) correctly', () => {
    const map = chordDegreeMap(0, [0, 3, 7, 10]);
    expect(map[0]).toBe('R');
    expect(map[3]).toBe('b3');
    expect(map[7]).toBe('5');
    expect(map[10]).toBe('b7');
  });

  it('maps C Maj7 (root=0, [0,4,7,11]) correctly', () => {
    const map = chordDegreeMap(0, [0, 4, 7, 11]);
    expect(map[0]).toBe('R');
    expect(map[4]).toBe('3');
    expect(map[7]).toBe('5');
    expect(map[11]).toBe('7');
  });

  it('handles non-zero root: G Maj (root=7, [0,4,7])', () => {
    const map = chordDegreeMap(7, [0, 4, 7]);
    expect(map[7]).toBe('R');      // G  (root at 7+0)
    expect(map[11]).toBe('3');     // B  (3rd at 7+4)
    expect(map[2]).toBe('5');      // D  (5th at (7+7)%12 = 2)
    // everything else null
    const nonNull = map.filter(v => v !== null);
    expect(nonNull).toHaveLength(3);
  });

  it('handles Bb Dim (root=10, [0,3,6])', () => {
    const map = chordDegreeMap(10, [0, 3, 6]);
    expect(map[10]).toBe('R');     // Bb
    expect(map[1]).toBe('b3');     // Db at (10+3)%12=1
    expect(map[4]).toBe('b5');     // E  at (10+6)%12=4
  });

  it('returns all nulls for empty intervals', () => {
    const map = chordDegreeMap(0, []);
    expect(map.every(v => v === null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// guideToneMask
// ---------------------------------------------------------------------------
describe('guideToneMask', () => {
  it('returns an array of 12 booleans', () => {
    const mask = guideToneMask(0, [0, 4, 7]);
    expect(mask).toHaveLength(12);
    mask.forEach(v => expect(typeof v).toBe('boolean'));
  });

  it('marks only the 3rd for C Maj [0,4,7]', () => {
    const mask = guideToneMask(0, [0, 4, 7]);
    // interval 4 is a guide tone (major 3rd)
    expect(mask[4]).toBe(true);
    // root (0) and 5th (7) are NOT guide tones
    expect(mask[0]).toBe(false);
    expect(mask[7]).toBe(false);
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(1);
  });

  it('marks b3 and b7 for C Min7 [0,3,7,10]', () => {
    const mask = guideToneMask(0, [0, 3, 7, 10]);
    expect(mask[3]).toBe(true);   // b3 (interval 3)
    expect(mask[10]).toBe(true);  // b7 (interval 10)
    expect(mask[0]).toBe(false);  // root
    expect(mask[7]).toBe(false);  // 5th
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(2);
  });

  it('marks 3 and 7 for C Maj7 [0,4,7,11]', () => {
    const mask = guideToneMask(0, [0, 4, 7, 11]);
    expect(mask[4]).toBe(true);   // major 3rd (interval 4)
    expect(mask[11]).toBe(true);  // major 7th (interval 11)
    expect(mask[0]).toBe(false);
    expect(mask[7]).toBe(false);
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(2);
  });

  it('marks 3 and b7 for C Dom7 [0,4,7,10]', () => {
    const mask = guideToneMask(0, [0, 4, 7, 10]);
    expect(mask[4]).toBe(true);   // major 3rd
    expect(mask[10]).toBe(true);  // b7
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(2);
  });

  it('handles non-zero root: G Min7 (root=7, [0,3,7,10])', () => {
    const mask = guideToneMask(7, [0, 3, 7, 10]);
    // b3: (7+3)%12 = 10
    expect(mask[10]).toBe(true);
    // b7: (7+10)%12 = 5
    expect(mask[5]).toBe(true);
    // root (7) and 5th ((7+7)%12=2) should be false
    expect(mask[7]).toBe(false);
    expect(mask[2]).toBe(false);
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(2);
  });

  it('marks nothing for a power chord [0,7] (no 3rds or 7ths)', () => {
    const mask = guideToneMask(0, [0, 7]);
    expect(mask.every(v => v === false)).toBe(true);
  });

  it('marks nothing for empty intervals', () => {
    const mask = guideToneMask(0, []);
    expect(mask.every(v => v === false)).toBe(true);
  });

  it('marks both b3 and 3 for 7#9 chord [0,3,4,7,10]', () => {
    const mask = guideToneMask(0, [0, 3, 4, 7, 10]);
    expect(mask[3]).toBe(true);   // b3 (interval 3)
    expect(mask[4]).toBe(true);   // 3  (interval 4)
    expect(mask[10]).toBe(true);  // b7 (interval 10)
    const trueCount = mask.filter(Boolean).length;
    expect(trueCount).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------
describe('sections', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
  });

  it('each section has a label and non-empty items array', () => {
    sections.forEach(section => {
      expect(typeof section.label).toBe('string');
      expect(section.label.length).toBeGreaterThan(0);
      expect(Array.isArray(section.items)).toBe(true);
      expect(section.items.length).toBeGreaterThan(0);
    });
  });

  it('each quality item has a name and intervals array', () => {
    sections.forEach(section => {
      section.items.forEach(item => {
        expect(typeof item.name).toBe('string');
        expect(item.name.length).toBeGreaterThan(0);
        expect(Array.isArray(item.intervals)).toBe(true);
        expect(item.intervals.length).toBeGreaterThan(0);
      });
    });
  });

  it('all intervals are numbers in range [0, 11]', () => {
    sections.forEach(section => {
      section.items.forEach(item => {
        item.intervals.forEach(interval => {
          expect(typeof interval).toBe('number');
          expect(interval).toBeGreaterThanOrEqual(0);
          expect(interval).toBeLessThanOrEqual(11);
        });
      });
    });
  });

  it('every quality starts with interval 0 (the root)', () => {
    sections.forEach(section => {
      section.items.forEach(item => {
        expect(item.intervals[0]).toBe(0);
      });
    });
  });

  it('contains expected section labels', () => {
    const labels = sections.map(s => s.label);
    expect(labels).toContain('Triads');
    expect(labels).toContain('Sevenths');
    expect(labels).toContain('Extended');
    expect(labels).toContain('Altered');
  });
});

// ---------------------------------------------------------------------------
// scaleSections
// ---------------------------------------------------------------------------
describe('scaleSections', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(scaleSections)).toBe(true);
    expect(scaleSections.length).toBeGreaterThan(0);
  });

  it('each scale section has a label, chords, and modes', () => {
    scaleSections.forEach(section => {
      expect(typeof section.label).toBe('string');
      expect(section.label.length).toBeGreaterThan(0);
      expect(Array.isArray(section.chords)).toBe(true);
      expect(section.chords.length).toBeGreaterThan(0);
      expect(Array.isArray(section.modes)).toBe(true);
      expect(section.modes.length).toBeGreaterThan(0);
    });
  });

  it('each chord entry has degree, interval, quality, and chordIntervals', () => {
    scaleSections.forEach(section => {
      section.chords.forEach(chord => {
        expect(typeof chord.degree).toBe('string');
        expect(typeof chord.interval).toBe('number');
        expect(typeof chord.quality).toBe('string');
        expect(Array.isArray(chord.chordIntervals)).toBe(true);
        expect(chord.chordIntervals.length).toBeGreaterThan(0);
      });
    });
  });

  it('each mode has a name and intervals starting with 0', () => {
    scaleSections.forEach(section => {
      section.modes.forEach(mode => {
        expect(typeof mode.name).toBe('string');
        expect(mode.name.length).toBeGreaterThan(0);
        expect(Array.isArray(mode.intervals)).toBe(true);
        expect(mode.intervals[0]).toBe(0);
      });
    });
  });

  it('contains expected scale families', () => {
    const labels = scaleSections.map(s => s.label);
    expect(labels).toContain('Major Scale');
    expect(labels).toContain('Melodic Minor');
    expect(labels).toContain('Harmonic Minor');
  });

  it('Major Scale section has 7 chords and 7 modes', () => {
    const major = scaleSections.find(s => s.label === 'Major Scale');
    expect(major).toBeDefined();
    expect(major!.chords).toHaveLength(7);
    expect(major!.modes).toHaveLength(7);
  });
});

// ---------------------------------------------------------------------------
// allQualities
// ---------------------------------------------------------------------------
describe('allQualities', () => {
  it('is a flat array of all quality items from sections', () => {
    const expectedCount = sections.reduce((acc, s) => acc + s.items.length, 0);
    expect(allQualities).toHaveLength(expectedCount);
  });

  it('contains known qualities', () => {
    const names = allQualities.map(q => q.name);
    expect(names).toContain('Maj');
    expect(names).toContain('Min');
    expect(names).toContain('Dim7');
    expect(names).toContain('Blues');
  });
});
