import { presets } from '../presets';
import type { Preset, PresetChord } from '../presets';
import { chordToForm } from '../chords';
import { flats } from '../notes';

describe('presets', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(presets)).toBe(true);
    expect(presets.length).toBeGreaterThan(0);
  });

  describe('every preset has required fields', () => {
    it.each(presets.map(p => [p.name, p]))('%s', (_name, preset) => {
      const p = preset as Preset;
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(['foundational', 'song']).toContain(p.category);
      expect(typeof p.defaultKey).toBe('number');
      expect(p.defaultKey).toBeGreaterThanOrEqual(0);
      expect(p.defaultKey).toBeLessThanOrEqual(11);
      expect(Array.isArray(p.chords)).toBe(true);
      expect(p.chords.length).toBeGreaterThan(0);
    });
  });

  describe('every preset chord has valid structure', () => {
    for (const preset of presets) {
      describe(`"${preset.name}" chords`, () => {
        it.each(preset.chords.map((c, i) => [`chord ${i} (${c.quality})`, c]))(
          '%s',
          (_label, chord) => {
            const c = chord as PresetChord;
            expect(typeof c.interval).toBe('number');
            expect(c.interval).toBeGreaterThanOrEqual(0);
            expect(c.interval).toBeLessThanOrEqual(11);
            expect(typeof c.quality).toBe('string');
            expect(c.quality.length).toBeGreaterThan(0);
            expect(Array.isArray(c.intervals)).toBe(true);
            expect(c.intervals.length).toBeGreaterThan(0);
            expect(c.intervals[0]).toBe(0);
            c.intervals.forEach(interval => {
              expect(typeof interval).toBe('number');
              expect(interval).toBeGreaterThanOrEqual(0);
              expect(interval).toBeLessThanOrEqual(11);
            });
          },
        );
      });
    }
  });

  describe('categories are only foundational or song', () => {
    it('all categories are valid', () => {
      const categories = new Set(presets.map(p => p.category));
      categories.forEach(cat => {
        expect(['foundational', 'song']).toContain(cat);
      });
    });

    it('has at least one foundational preset', () => {
      expect(presets.some(p => p.category === 'foundational')).toBe(true);
    });

    it('has at least one song preset', () => {
      expect(presets.some(p => p.category === 'song')).toBe(true);
    });
  });

  describe('song presets with sharps: true have sharp-key defaultKeys', () => {
    const SHARP_KEYS = [7, 9, 2, 4, 11]; // G, A, D, E, B

    const sharpPresets = presets.filter(p => p.sharps === true);

    it('there is at least one preset with sharps: true', () => {
      expect(sharpPresets.length).toBeGreaterThan(0);
    });

    it.each(sharpPresets.map(p => [p.name, p]))(
      '%s has a sharp-key defaultKey',
      (_name, preset) => {
        const p = preset as Preset;
        expect(SHARP_KEYS).toContain(p.defaultKey);
      },
    );
  });

  describe('building a progression from each preset produces valid chord forms', () => {
    it.each(presets.map(p => [p.name, p]))(
      '%s yields valid forms for all chords',
      (_name, preset) => {
        const p = preset as Preset;
        for (const chord of p.chords) {
          const root = (p.defaultKey + chord.interval) % 12;
          const form = chordToForm(root, chord.intervals);

          // form is a boolean array of length 12
          expect(form).toHaveLength(12);
          form.forEach(val => expect(typeof val).toBe('boolean'));

          // at least one note should be active
          expect(form.some(v => v)).toBe(true);

          // the root note should be active
          expect(form[root]).toBe(true);

          // number of true values matches number of unique intervals mod 12
          const uniqueIntervals = new Set(chord.intervals.map(i => (root + i) % 12));
          const trueCount = form.filter(v => v).length;
          expect(trueCount).toBe(uniqueIntervals.size);
        }
      },
    );
  });

  describe('no duplicate preset names', () => {
    it('all names are unique', () => {
      const names = presets.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('names with case-insensitive comparison are still unique', () => {
      const lowerNames = presets.map(p => p.name.toLowerCase());
      const uniqueLower = new Set(lowerNames);
      expect(uniqueLower.size).toBe(lowerNames.length);
    });
  });
});
