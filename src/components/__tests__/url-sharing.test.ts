/**
 * Unit tests for URL sharing encode/decode logic.
 *
 * App.tsx encodes progressions as:
 *   ?p=C%20Maj,G%20Maj,A%20Min
 *
 * And decodes with:
 *   p.split(',').map(s => parseChordName(decodeURIComponent(s.trim())))
 */

import { parseChordName } from '../form/helpers/chords';

describe('parseChordName basics', () => {
  it('parses a simple major chord', () => {
    const result = parseChordName('C Maj');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('C Maj');
    expect(result!.form).toHaveLength(12);
    expect(result!.form.some(v => v)).toBe(true);
  });

  it('parses a minor chord', () => {
    const result = parseChordName('A Min');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('A Min');
  });

  it('parses a dominant seventh chord', () => {
    const result = parseChordName('G 7');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('G 7');
  });

  it('parses a sharp-root chord', () => {
    const result = parseChordName('C# Min7');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('C# Min7');
  });

  it('parses a flat-root chord', () => {
    const result = parseChordName('Bb 7');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Bb 7');
  });
});

describe('parseChordName returns null for invalid input', () => {
  it('returns null for an empty string', () => {
    expect(parseChordName('')).toBeNull();
  });

  it('returns null for random text', () => {
    expect(parseChordName('XYZ')).toBeNull();
  });

  it('returns null for a bare note name with no quality', () => {
    expect(parseChordName('C')).toBeNull();
  });

  it('returns null for a note with an invalid quality', () => {
    expect(parseChordName('C InvalidQuality')).toBeNull();
  });

  it('returns null for a valid quality with invalid root', () => {
    expect(parseChordName('X Maj')).toBeNull();
  });

  it('returns null for only whitespace', () => {
    expect(parseChordName(' ')).toBeNull();
  });
});

describe('URL encoding round-trip', () => {
  it('round-trips "C Maj" through encodeURIComponent and back', () => {
    const original = 'C Maj';
    const encoded = encodeURIComponent(original);
    expect(encoded).toBe('C%20Maj');
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(original);
    const result = parseChordName(decoded);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(original);
    expect(result!.form).toHaveLength(12);
  });

  it('round-trips "C# Min7" through URL encoding', () => {
    const original = 'C# Min7';
    const encoded = encodeURIComponent(original);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(original);
    const result = parseChordName(decoded);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(original);
  });

  it('round-trips "Bb 7" through URL encoding', () => {
    const original = 'Bb 7';
    const encoded = encodeURIComponent(original);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(original);
    const result = parseChordName(decoded);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(original);
  });

  it('round-trips "Eb Min7b5" through URL encoding', () => {
    const original = 'Eb Min7b5';
    const encoded = encodeURIComponent(original);
    const decoded = decodeURIComponent(encoded);
    const result = parseChordName(decoded);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(original);
  });

  it('round-trips "F# Dim7" through URL encoding', () => {
    const original = 'F# Dim7';
    const encoded = encodeURIComponent(original);
    const decoded = decodeURIComponent(encoded);
    const result = parseChordName(decoded);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(original);
  });
});

describe('comma-separated chord list (?p= format)', () => {
  // Mirrors the App.tsx decode logic:
  //   p.split(',').map(s => parseChordName(decodeURIComponent(s.trim())))

  function decodePParam(pValue: string) {
    return pValue
      .split(',')
      .map(s => parseChordName(decodeURIComponent(s.trim())))
      .filter(Boolean);
  }

  it('decodes a two-chord progression', () => {
    const p = 'C%20Maj,G%20Maj';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(2);
    expect(chords[0]!.name).toBe('C Maj');
    expect(chords[1]!.name).toBe('G Maj');
  });

  it('decodes a four-chord progression', () => {
    const p = 'C%20Maj,G%20Maj,A%20Min,F%20Maj';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(4);
    expect(chords[0]!.name).toBe('C Maj');
    expect(chords[1]!.name).toBe('G Maj');
    expect(chords[2]!.name).toBe('A Min');
    expect(chords[3]!.name).toBe('F Maj');
  });

  it('decodes a progression with sharp and flat roots', () => {
    const p = 'C%23%20Min7,Bb%207';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(2);
    expect(chords[0]!.name).toBe('C# Min7');
    expect(chords[1]!.name).toBe('Bb 7');
  });

  it('filters out invalid chord names in the list', () => {
    const p = 'C%20Maj,INVALID,G%20Maj';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(2);
    expect(chords[0]!.name).toBe('C Maj');
    expect(chords[1]!.name).toBe('G Maj');
  });

  it('returns empty array for entirely invalid input', () => {
    const p = 'INVALID,ALSO_INVALID,NOPE';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(0);
  });

  it('handles a single chord in the p param', () => {
    const p = 'D%20Min7';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(1);
    expect(chords[0]!.name).toBe('D Min7');
  });

  it('produces forms with correct shape for every decoded chord', () => {
    const p = 'C%20Maj,G%207,A%20Min,F%20Maj7';
    const chords = decodePParam(p);
    expect(chords).toHaveLength(4);
    for (const chord of chords) {
      expect(chord!.form).toHaveLength(12);
      expect(chord!.form.every(v => typeof v === 'boolean')).toBe(true);
      expect(chord!.form.some(v => v)).toBe(true);
    }
  });
});

describe('shareProgression encoding', () => {
  // Mirrors shareProgression from App.tsx:
  //   progression.map(c => encodeURIComponent(c.name)).join(',')

  function encodeProgression(names: string[]): string {
    return names.map(n => encodeURIComponent(n)).join(',');
  }

  function decodePParam(pValue: string) {
    return pValue
      .split(',')
      .map(s => parseChordName(decodeURIComponent(s.trim())))
      .filter(Boolean);
  }

  it('full round-trip: encode then decode a progression', () => {
    const names = ['C Maj', 'G Maj', 'A Min', 'F Maj'];
    const encoded = encodeProgression(names);
    const decoded = decodePParam(encoded);
    expect(decoded).toHaveLength(names.length);
    decoded.forEach((chord, i) => {
      expect(chord!.name).toBe(names[i]);
    });
  });

  it('full round-trip with sharp/flat chord names', () => {
    const names = ['C# Min7', 'Bb 7', 'F# Dim7', 'Eb Maj7'];
    const encoded = encodeProgression(names);
    const decoded = decodePParam(encoded);
    expect(decoded).toHaveLength(names.length);
    decoded.forEach((chord, i) => {
      expect(chord!.name).toBe(names[i]);
    });
  });

  it('encoded string does not contain raw spaces', () => {
    const names = ['C Maj', 'G 7'];
    const encoded = encodeProgression(names);
    expect(encoded).not.toContain(' ');
    expect(encoded).toContain('%20');
  });

  it('encoded string uses commas as separators', () => {
    const names = ['C Maj', 'G Maj', 'A Min'];
    const encoded = encodeProgression(names);
    // commas should appear between chords but not be URL-encoded
    const parts = encoded.split(',');
    expect(parts).toHaveLength(3);
  });
});
