import { flats, sharps, both, renotate } from '../notes';

// ---------------------------------------------------------------------------
// flats array
// ---------------------------------------------------------------------------
describe('flats', () => {
  it('has exactly 12 elements', () => {
    expect(flats).toHaveLength(12);
  });

  it('starts with C and ends with B', () => {
    expect(flats[0]).toBe('C');
    expect(flats[11]).toBe('B');
  });

  it('contains the correct values at known indices', () => {
    expect(flats[0]).toBe('C');
    expect(flats[1]).toBe('Db');
    expect(flats[2]).toBe('D');
    expect(flats[3]).toBe('Eb');
    expect(flats[4]).toBe('E');
    expect(flats[5]).toBe('F');
    expect(flats[6]).toBe('Gb');
    expect(flats[7]).toBe('G');
    expect(flats[8]).toBe('Ab');
    expect(flats[9]).toBe('A');
    expect(flats[10]).toBe('Bb');
    expect(flats[11]).toBe('B');
  });

  it('contains flat names (Db, Eb, Gb, Ab, Bb) not sharps', () => {
    expect(flats).toContain('Db');
    expect(flats).toContain('Eb');
    expect(flats).toContain('Gb');
    expect(flats).toContain('Ab');
    expect(flats).toContain('Bb');
    expect(flats).not.toContain('C#');
    expect(flats).not.toContain('D#');
    expect(flats).not.toContain('F#');
    expect(flats).not.toContain('G#');
    expect(flats).not.toContain('A#');
  });
});

// ---------------------------------------------------------------------------
// sharps array
// ---------------------------------------------------------------------------
describe('sharps', () => {
  it('has exactly 12 elements', () => {
    expect(sharps).toHaveLength(12);
  });

  it('starts with C and ends with B', () => {
    expect(sharps[0]).toBe('C');
    expect(sharps[11]).toBe('B');
  });

  it('contains the correct values at known indices', () => {
    expect(sharps[0]).toBe('C');
    expect(sharps[1]).toBe('C#');
    expect(sharps[2]).toBe('D');
    expect(sharps[3]).toBe('D#');
    expect(sharps[4]).toBe('E');
    expect(sharps[5]).toBe('F');
    expect(sharps[6]).toBe('F#');
    expect(sharps[7]).toBe('G');
    expect(sharps[8]).toBe('G#');
    expect(sharps[9]).toBe('A');
    expect(sharps[10]).toBe('A#');
    expect(sharps[11]).toBe('B');
  });

  it('contains sharp names (C#, D#, F#, G#, A#) not flats', () => {
    expect(sharps).toContain('C#');
    expect(sharps).toContain('D#');
    expect(sharps).toContain('F#');
    expect(sharps).toContain('G#');
    expect(sharps).toContain('A#');
    expect(sharps).not.toContain('Db');
    expect(sharps).not.toContain('Eb');
    expect(sharps).not.toContain('Gb');
    expect(sharps).not.toContain('Ab');
    expect(sharps).not.toContain('Bb');
  });
});

// ---------------------------------------------------------------------------
// both array
// ---------------------------------------------------------------------------
describe('both', () => {
  it('has exactly 12 elements', () => {
    expect(both).toHaveLength(12);
  });

  it('uses combined names for accidentals', () => {
    expect(both[1]).toBe('C#/Db');
    expect(both[3]).toBe('D#/Eb');
    expect(both[6]).toBe('F#/Gb');
    expect(both[8]).toBe('G#/Ab');
    expect(both[10]).toBe('A#/Bb');
  });

  it('uses plain names for natural notes', () => {
    expect(both[0]).toBe('C');
    expect(both[2]).toBe('D');
    expect(both[4]).toBe('E');
    expect(both[5]).toBe('F');
    expect(both[7]).toBe('G');
    expect(both[9]).toBe('A');
    expect(both[11]).toBe('B');
  });
});

// ---------------------------------------------------------------------------
// renotate
// ---------------------------------------------------------------------------
describe('renotate', () => {
  it('returns the name unchanged when using flats notation', () => {
    expect(renotate('Db Maj7', flats)).toBe('Db Maj7');
    expect(renotate('Eb Min', flats)).toBe('Eb Min');
    expect(renotate('Bb 7', flats)).toBe('Bb 7');
  });

  it('converts flat root to sharp root when using sharps notation', () => {
    expect(renotate('Db Maj7', sharps)).toBe('C# Maj7');
    expect(renotate('Eb Min', sharps)).toBe('D# Min');
    expect(renotate('Gb Dim', sharps)).toBe('F# Dim');
    expect(renotate('Ab 7', sharps)).toBe('G# 7');
    expect(renotate('Bb Min7', sharps)).toBe('A# Min7');
  });

  it('leaves natural note roots unchanged when using sharps notation', () => {
    expect(renotate('C Maj', sharps)).toBe('C Maj');
    expect(renotate('D Min', sharps)).toBe('D Min');
    expect(renotate('E 7', sharps)).toBe('E 7');
    expect(renotate('F Maj7', sharps)).toBe('F Maj7');
    expect(renotate('G Dim', sharps)).toBe('G Dim');
    expect(renotate('A Min7', sharps)).toBe('A Min7');
    expect(renotate('B Maj', sharps)).toBe('B Maj');
  });

  it('returns the name unchanged if there is no space (no quality part)', () => {
    expect(renotate('CMaj7', sharps)).toBe('CMaj7');
    expect(renotate('CMaj7', flats)).toBe('CMaj7');
  });

  it('preserves multi-word quality names after the root', () => {
    // renotate only converts the root; everything after the first space is preserved
    expect(renotate('Db Maj Blues', sharps)).toBe('C# Maj Blues');
  });

  it('handles "C Maj" with no flat/sharp conversion needed', () => {
    expect(renotate('C Maj', flats)).toBe('C Maj');
    expect(renotate('C Maj', sharps)).toBe('C Maj');
  });
});
