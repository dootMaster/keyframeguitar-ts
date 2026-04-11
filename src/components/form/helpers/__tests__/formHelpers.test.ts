import { updateFretboardViaForm } from '../formHelpers';
import createFretboard from '../../../fretboard/helpers/createFretboard';

// Standard guitar tuning (open strings) expressed as chromatic indices:
// E=4, A=9, D=2, G=7, B=11, E=4
const STANDARD_TUNING = [4, 9, 2, 7, 11, 4];

/**
 * Helper: build a boolean[12] form from an array of active note indices.
 */
function makeForm(activeIndices: number[]): boolean[] {
  const form = new Array(12).fill(false);
  activeIndices.forEach(i => { form[i] = true; });
  return form;
}

/**
 * Helper: collect all unique display values from a fretboard.
 */
function collectDisplayValues(fretboard: { display: string; dictIndex: number }[][]): Set<string> {
  const values = new Set<string>();
  fretboard.forEach(gtrString => {
    gtrString.forEach(fret => values.add(fret.display));
  });
  return values;
}

/**
 * Helper: find all frets matching a given dictIndex and return their display values.
 */
function getDisplaysForNote(
  fretboard: { display: string; dictIndex: number }[][],
  dictIndex: number,
): string[] {
  const displays: string[] = [];
  fretboard.forEach(gtrString => {
    gtrString.forEach(fret => {
      if (fret.dictIndex === dictIndex) displays.push(fret.display);
    });
  });
  return displays;
}

// ---------------------------------------------------------------------------
// updateFretboardViaForm
// ---------------------------------------------------------------------------
describe('updateFretboardViaForm', () => {
  it('sets fret display to "common" when a note is in both forms', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    // C Maj = indices 0 (C), 4 (E), 7 (G)
    // G Maj = indices 7 (G), 11 (B), 2 (D)
    const fromForm = makeForm([0, 4, 7]);  // C Maj
    const toForm = makeForm([7, 11, 2]);   // G Maj

    // key='from' means updatedNotesState is the from form
    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // G (index 7) is in both C Maj and G Maj -> common
    const gDisplays = getDisplaysForNote(fretboard, 7);
    gDisplays.forEach(d => expect(d).toBe('common'));
  });

  it('sets fret display to "from" when note is only in the from form', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const fromForm = makeForm([0, 4, 7]);  // C Maj
    const toForm = makeForm([7, 11, 2]);   // G Maj

    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // C (index 0) is only in C Maj (from), not in G Maj (to) -> from
    const cDisplays = getDisplaysForNote(fretboard, 0);
    cDisplays.forEach(d => expect(d).toBe('from'));

    // E (index 4) is only in C Maj (from), not in G Maj (to) -> from
    const eDisplays = getDisplaysForNote(fretboard, 4);
    eDisplays.forEach(d => expect(d).toBe('from'));
  });

  it('sets fret display to "to" when note is only in the to form', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const fromForm = makeForm([0, 4, 7]);  // C Maj
    const toForm = makeForm([7, 11, 2]);   // G Maj

    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // B (index 11) is only in G Maj (to) -> to
    const bDisplays = getDisplaysForNote(fretboard, 11);
    bDisplays.forEach(d => expect(d).toBe('to'));

    // D (index 2) is only in G Maj (to) -> to
    const dDisplays = getDisplaysForNote(fretboard, 2);
    dDisplays.forEach(d => expect(d).toBe('to'));
  });

  it('sets fret display to "neutral" when note is in neither form', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const fromForm = makeForm([0, 4, 7]);  // C Maj
    const toForm = makeForm([7, 11, 2]);   // G Maj

    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // F (index 5) is in neither chord -> neutral
    const fDisplays = getDisplaysForNote(fretboard, 5);
    fDisplays.forEach(d => expect(d).toBe('neutral'));

    // Ab/G# (index 8) is in neither chord -> neutral
    const abDisplays = getDisplaysForNote(fretboard, 8);
    abDisplays.forEach(d => expect(d).toBe('neutral'));
  });

  it('correctly assigns display values when key is "to"', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    // When key='to', updatedNotesState is the to form and otherForm is the from form
    const fromForm = makeForm([0, 4, 7]);   // C Maj
    const toForm = makeForm([7, 11, 2]);    // G Maj

    // key='to' means: updatedNotesState=toForm, otherForm=fromForm
    updateFretboardViaForm(fretboard, fromForm, toForm, 'to');

    // G (7) in both -> common
    getDisplaysForNote(fretboard, 7).forEach(d => expect(d).toBe('common'));
    // C (0) only in from -> from
    getDisplaysForNote(fretboard, 0).forEach(d => expect(d).toBe('from'));
    // B (11) only in to -> to
    getDisplaysForNote(fretboard, 11).forEach(d => expect(d).toBe('to'));
    // F (5) in neither -> neutral
    getDisplaysForNote(fretboard, 5).forEach(d => expect(d).toBe('neutral'));
  });

  it('handles empty forms (all notes become neutral)', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const emptyForm = makeForm([]);

    updateFretboardViaForm(fretboard, emptyForm, emptyForm, 'from');

    const displays = collectDisplayValues(fretboard);
    expect(displays.size).toBe(1);
    expect(displays.has('neutral')).toBe(true);
  });

  it('handles identical forms (all active notes become common)', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const form = makeForm([0, 4, 7]); // C Maj

    updateFretboardViaForm(fretboard, form, form, 'from');

    // All C Maj notes should be common
    getDisplaysForNote(fretboard, 0).forEach(d => expect(d).toBe('common'));
    getDisplaysForNote(fretboard, 4).forEach(d => expect(d).toBe('common'));
    getDisplaysForNote(fretboard, 7).forEach(d => expect(d).toBe('common'));

    // Non-chord tones should be neutral
    getDisplaysForNote(fretboard, 1).forEach(d => expect(d).toBe('neutral'));
  });

  it('mutates the original fretboard (does not return a new one)', () => {
    const fretboard = createFretboard(STANDARD_TUNING);
    const form = makeForm([0, 4, 7]);
    const emptyForm = makeForm([]);

    const originalRef = fretboard;
    updateFretboardViaForm(fretboard, emptyForm, form, 'from');

    expect(fretboard).toBe(originalRef);
    // Check that it was actually modified
    getDisplaysForNote(fretboard, 0).forEach(d => expect(d).toBe('from'));
  });

  it('works with a single-string tuning', () => {
    // A single string starting on C (index 0)
    const fretboard = createFretboard([0]);
    const fromForm = makeForm([0, 4]);     // C, E
    const toForm = makeForm([4, 7]);       // E, G

    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // C (0): only in from -> from
    getDisplaysForNote(fretboard, 0).forEach(d => expect(d).toBe('from'));
    // E (4): in both -> common
    getDisplaysForNote(fretboard, 4).forEach(d => expect(d).toBe('common'));
    // G (7): only in to -> to
    getDisplaysForNote(fretboard, 7).forEach(d => expect(d).toBe('to'));
    // D (2): in neither -> neutral
    getDisplaysForNote(fretboard, 2).forEach(d => expect(d).toBe('neutral'));
  });

  it('correctly handles all 12 chromatic notes across the fretboard', () => {
    // A full chromatic from form and a different full chromatic to form
    const fretboard = createFretboard([0]); // single string from C
    const fromForm = makeForm([0, 2, 4, 5, 7, 9, 11]); // C major scale
    const toForm = makeForm([0, 2, 3, 5, 7, 8, 10]);   // C natural minor scale

    updateFretboardViaForm(fretboard, toForm, fromForm, 'from');

    // Common: C(0), D(2), F(5), G(7)
    [0, 2, 5, 7].forEach(idx => {
      getDisplaysForNote(fretboard, idx).forEach(d => expect(d).toBe('common'));
    });
    // From only: E(4), A(9), B(11)
    [4, 9, 11].forEach(idx => {
      getDisplaysForNote(fretboard, idx).forEach(d => expect(d).toBe('from'));
    });
    // To only: Eb(3), Ab(8), Bb(10)
    [3, 8, 10].forEach(idx => {
      getDisplaysForNote(fretboard, idx).forEach(d => expect(d).toBe('to'));
    });
    // Neutral: F#/Gb(6) and C#/Db(1)
    [1, 6].forEach(idx => {
      getDisplaysForNote(fretboard, idx).forEach(d => expect(d).toBe('neutral'));
    });
  });
});
