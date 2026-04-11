import React from 'react';
import { render } from '@testing-library/react';
import GtrString from '../GtrString';
import { flat } from '../helpers/stringDict';
import { chordDegreeMap, guideToneMask } from '../../form/helpers/chords';

// Helper: build a minimal gtrString array (13 frets, standard tuning high E string root=4)
function makeGtrString(fromForm: boolean[], toForm: boolean[]): { display: string; dictIndex: number }[] {
  const frets = [];
  for (let j = 0; j < 13; j++) {
    const dictIndex = (4 + j) % 12; // high E string starts at index 4
    const inFrom = fromForm[dictIndex];
    const inTo = toForm[dictIndex];
    let display = 'neutral';
    if (inFrom && inTo) display = 'common';
    else if (inFrom) display = 'from';
    else if (inTo) display = 'to';
    frets.push({ display, dictIndex });
  }
  return frets;
}

function renderGtrString(overrides: Partial<Parameters<typeof GtrString>[0]> = {}) {
  const emptyForm = new Array(12).fill(false);
  const props = {
    gtrString: makeGtrString(emptyForm, emptyForm),
    i: 0,
    toggleFret: () => {},
    flat,
    noteDisplayMode: 'off' as const,
    peekForm: null,
    previewForm: null,
    fromDegrees: new Array(12).fill(null),
    toDegrees: new Array(12).fill(null),
    fromGuide: new Array(12).fill(false),
    toGuide: new Array(12).fill(false),
    showGuideTones: false,
    soloActive: false,
    ...overrides,
  };
  return render(
    <table>
      <tbody>
        <GtrString {...props} />
      </tbody>
    </table>,
  );
}

// ── Scenario: C Maj (C=0, E=4, G=7) → A Min (A=9, C=0, E=4) ──
// Common: C (0), E (4)
// From only: G (7)
// To only: A (9)
// Guide tones: C Maj 3rd = E (interval 4), A Min b3rd = C (interval 3→index 0)
const cMajForm = [true, false, false, false, true, false, false, true, false, false, false, false];
const aMinForm = [true, false, false, false, true, false, false, false, false, true, false, false];
const cMajDegrees = chordDegreeMap(0, [0, 4, 7]);   // C=R, E=3, G=5
const aMinDegrees = chordDegreeMap(9, [0, 3, 7]);   // A=R, C=b3, E=5
const cMajGuide = guideToneMask(0, [0, 4, 7]);      // E (index 4) is guide tone
const aMinGuide = guideToneMask(9, [0, 3, 7]);      // C (index 0) is guide tone

describe('GtrString guide tone + solo interaction', () => {
  it('common tone that is guide of either chord is NOT dimmed when not soloed', () => {
    // C (index 0) is b3 of A Min (guide tone of to chord)
    // E (index 4) is 3 of C Maj (guide tone of from chord)
    // Neither should be dimmed
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td');
    // Find common frets — fret 0 on high E string has dictIndex=4 (E), fret 8 has dictIndex=0 (C)
    const eFret = Array.from(tds).find(td => td.dataset.fret === '0'); // dictIndex = 4 (E)
    const cFret = Array.from(tds).find(td => td.dataset.fret === '8'); // dictIndex = (4+8)%12 = 0 (C)
    expect(eFret!.className).toContain('common');
    expect(eFret!.className).not.toContain('guide-dimmed');
    expect(cFret!.className).toContain('common');
    expect(cFret!.className).not.toContain('guide-dimmed');
  });

  it('common tone that is only guide of TO chord IS dimmed when solo is active', () => {
    // C (index 0): fromGuide=false (root of C Maj), toGuide=true (b3 of A Min)
    // When solo is active, should only check fromGuide → not a guide tone → dimmed
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
      soloActive: true,
    });
    const tds = container.querySelectorAll('td');
    const cFret = Array.from(tds).find(td => td.dataset.fret === '8'); // dictIndex=0 (C)
    expect(cFret!.className).toContain('common');
    expect(cFret!.className).toContain('guide-dimmed');
  });

  it('common tone that is guide of FROM chord is NOT dimmed when solo is active', () => {
    // E (index 4): fromGuide=true (3rd of C Maj)
    // Even during solo, E should stay bright
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
      soloActive: true,
    });
    const tds = container.querySelectorAll('td');
    const eFret = Array.from(tds).find(td => td.dataset.fret === '0'); // dictIndex=4 (E)
    expect(eFret!.className).toContain('common');
    expect(eFret!.className).not.toContain('guide-dimmed');
  });

  it('from-only fret that is not a guide tone is dimmed', () => {
    // G (index 7): 5th of C Maj, not a guide tone
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td');
    const gFret = Array.from(tds).find(td => td.dataset.fret === '3'); // dictIndex=(4+3)%12=7 (G)
    expect(gFret!.className).toContain('from');
    expect(gFret!.className).toContain('guide-dimmed');
  });

  it('to-only fret that is not a guide tone is dimmed', () => {
    // A (index 9): root of A Min, not a guide tone
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td');
    const aFret = Array.from(tds).find(td => td.dataset.fret === '5'); // dictIndex=(4+5)%12=9 (A)
    expect(aFret!.className).toContain('to');
    expect(aFret!.className).toContain('guide-dimmed');
  });

  it('no frets are dimmed when showGuideTones is false', () => {
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: false,
    });
    const dimmed = container.querySelectorAll('.guide-dimmed');
    expect(dimmed.length).toBe(0);
  });

  it('neutral frets are never dimmed even with showGuideTones true', () => {
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromGuide: cMajGuide,
      toGuide: aMinGuide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td.neutral');
    tds.forEach(td => {
      expect(td.className).not.toContain('guide-dimmed');
    });
  });
});

// ── Scenario: Dm7 (D=2, F=5, A=9, C=0) → G7 (G=7, B=11, D=2, F=5) ──
// Classic ii-V guide tone voice leading
// Common: D (2), F (5)
// Dm7 guide tones: F (b3, index 5), C (b7, index 0)
// G7 guide tones: B (3, index 11), F (b7, index 5)
const dm7Form = [true, false, true, false, false, true, false, false, false, true, false, false];
const g7Form = [false, false, true, false, false, true, false, true, false, false, false, true];
const dm7Guide = guideToneMask(2, [0, 3, 7, 10]);  // F (5) and C (0)
const g7Guide = guideToneMask(7, [0, 4, 7, 10]);   // B (11) and F (5)

describe('GtrString ii-V guide tone voice leading', () => {
  it('F is a guide tone of both chords and never dimmed', () => {
    // F (index 5): b3 of Dm7 AND b7 of G7
    const { container } = renderGtrString({
      gtrString: makeGtrString(dm7Form, g7Form),
      fromGuide: dm7Guide,
      toGuide: g7Guide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td');
    const fFret = Array.from(tds).find(td => td.dataset.fret === '1'); // dictIndex=(4+1)%12=5 (F)
    expect(fFret!.className).toContain('common');
    expect(fFret!.className).not.toContain('guide-dimmed');
  });

  it('D is common but not a guide tone of either chord — dimmed', () => {
    // D (index 2): root of Dm7, 5th of G7 — neither is a guide tone
    const { container } = renderGtrString({
      gtrString: makeGtrString(dm7Form, g7Form),
      fromGuide: dm7Guide,
      toGuide: g7Guide,
      showGuideTones: true,
    });
    const tds = container.querySelectorAll('td');
    const dFret = Array.from(tds).find(td => td.dataset.fret === '10'); // dictIndex=(4+10)%12=2 (D)
    expect(dFret!.className).toContain('common');
    expect(dFret!.className).toContain('guide-dimmed');
  });

  it('during solo, D (common, root of Dm7) is still dimmed', () => {
    const { container } = renderGtrString({
      gtrString: makeGtrString(dm7Form, g7Form),
      fromGuide: dm7Guide,
      toGuide: g7Guide,
      showGuideTones: true,
      soloActive: true,
    });
    const tds = container.querySelectorAll('td');
    const dFret = Array.from(tds).find(td => td.dataset.fret === '10');
    expect(dFret!.className).toContain('guide-dimmed');
  });

  it('during solo, F (common, b3 of Dm7) stays bright because it is a from guide tone', () => {
    const { container } = renderGtrString({
      gtrString: makeGtrString(dm7Form, g7Form),
      fromGuide: dm7Guide,
      toGuide: g7Guide,
      showGuideTones: true,
      soloActive: true,
    });
    const tds = container.querySelectorAll('td');
    const fFret = Array.from(tds).find(td => td.dataset.fret === '1');
    expect(fFret!.className).not.toContain('guide-dimmed');
  });
});

describe('GtrString degree label assignment', () => {
  it('from fret gets degree from fromDegrees', () => {
    // G (index 7) is from-only in C Maj → A Min. fromDegrees[7] = "5"
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      noteDisplayMode: 'degrees',
    });
    const tds = container.querySelectorAll('td');
    const gFret = Array.from(tds).find(td => td.dataset.fret === '3'); // dictIndex=7 (G)
    expect(gFret!.textContent).toBe('5');
  });

  it('to fret gets degree from toDegrees', () => {
    // A (index 9) is to-only in C Maj → A Min. toDegrees[9] = "R"
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      noteDisplayMode: 'degrees',
    });
    const tds = container.querySelectorAll('td');
    const aFret = Array.from(tds).find(td => td.dataset.fret === '5'); // dictIndex=9 (A)
    expect(aFret!.textContent).toBe('R');
  });

  it('common fret gets degree from fromDegrees', () => {
    // C (index 0) is common. fromDegrees[0] = "R" (root of C Maj)
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      noteDisplayMode: 'degrees',
    });
    const tds = container.querySelectorAll('td');
    const cFret = Array.from(tds).find(td => td.dataset.fret === '8'); // dictIndex=0 (C)
    expect(cFret!.textContent).toBe('R');
  });

  it('neutral fret shows nothing in degrees mode', () => {
    const { container } = renderGtrString({
      gtrString: makeGtrString(cMajForm, aMinForm),
      fromDegrees: cMajDegrees,
      toDegrees: aMinDegrees,
      noteDisplayMode: 'degrees',
    });
    const tds = container.querySelectorAll('td.neutral');
    tds.forEach(td => {
      expect(td.textContent).toBe('\u00A0');
    });
  });
});
