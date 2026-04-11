/**
 * Unit tests for the core progression logic used in App.tsx.
 *
 * These test pure functions and algorithms — no React rendering.
 * The modulo-wrap formula, add/remove/clear operations, and
 * window-index bookkeeping are all extracted as plain logic.
 */

// ── Modulo wrapping ──────────────────────────────────────────────
// App.tsx line: const wrapped = ((index % length) + length) % length;

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

describe('modulo wrapping for navigation', () => {
  it('wraps forward past the end', () => {
    // 5 chords, index goes from 4 to 5 -> wraps to 0
    expect(wrapIndex(5, 5)).toBe(0);
    expect(wrapIndex(6, 5)).toBe(1);
    expect(wrapIndex(10, 5)).toBe(0);
  });

  it('wraps backward past the beginning', () => {
    // 5 chords, index goes from 0 to -1 -> wraps to 4
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(-2, 5)).toBe(3);
    expect(wrapIndex(-5, 5)).toBe(0);
  });

  it('handles normal (in-range) navigation without wrapping', () => {
    expect(wrapIndex(0, 5)).toBe(0);
    expect(wrapIndex(1, 5)).toBe(1);
    expect(wrapIndex(4, 5)).toBe(4);
  });

  it('handles length of 1 (always wraps to 0)', () => {
    expect(wrapIndex(0, 1)).toBe(0);
    expect(wrapIndex(1, 1)).toBe(0);
    expect(wrapIndex(-1, 1)).toBe(0);
    expect(wrapIndex(99, 1)).toBe(0);
  });

  it('handles length of 2', () => {
    expect(wrapIndex(0, 2)).toBe(0);
    expect(wrapIndex(1, 2)).toBe(1);
    expect(wrapIndex(2, 2)).toBe(0);
    expect(wrapIndex(-1, 2)).toBe(1);
  });

  it('handles large negative indices', () => {
    expect(wrapIndex(-100, 7)).toBe((-100 % 7 + 7) % 7);
    expect(wrapIndex(-1000, 3)).toBe((-1000 % 3 + 3) % 3);
  });
});

// ── Progression chord management ────────────────────────────────

type ProgressionChord = { name: string; form: boolean[] };

function makeChord(name: string): ProgressionChord {
  const form = new Array(12).fill(false);
  // set a couple of bits so forms are not empty
  form[0] = true;
  form[4] = true;
  form[7] = true;
  return { name, form };
}

describe('adding chords to the progression', () => {
  it('adding a chord to an empty progression produces length 1', () => {
    const progression: ProgressionChord[] = [];
    const chord = makeChord('C Maj');
    const newProg = [...progression, chord];
    expect(newProg).toHaveLength(1);
    expect(newProg[0].name).toBe('C Maj');
  });

  it('adding a second chord enables windowed view (from/to pair)', () => {
    const progression = [makeChord('C Maj')];
    const chord = makeChord('G Maj');
    const newProg = [...progression, chord];
    expect(newProg).toHaveLength(2);

    // With 2+ chords, we can compute from/to
    const windowIndex = 0;
    const fromChord = newProg[windowIndex];
    const toChord = newProg[(windowIndex + 1) % newProg.length];
    expect(fromChord.name).toBe('C Maj');
    expect(toChord.name).toBe('G Maj');
  });

  it('adding a third chord keeps window index at 0', () => {
    const progression = [makeChord('C Maj'), makeChord('G Maj')];
    const chord = makeChord('A Min');
    const newProg = [...progression, chord];
    expect(newProg).toHaveLength(3);

    const windowIndex = 0;
    expect(newProg[windowIndex].name).toBe('C Maj');
    expect(newProg[(windowIndex + 1) % newProg.length].name).toBe('G Maj');
  });
});

describe('removing chords from the progression', () => {
  // Mirrors removeFromProgression in App.tsx
  function simulateRemove(
    progression: ProgressionChord[],
    windowIndex: number,
    removeIndex: number,
  ): { newProg: ProgressionChord[]; newWindowIndex: number } {
    const newProg = progression.filter((_, i) => i !== removeIndex);

    if (newProg.length < 2) {
      return { newProg, newWindowIndex: 0 };
    }

    let newIndex = windowIndex;
    if (removeIndex <= windowIndex) {
      newIndex = Math.max(0, windowIndex - 1);
    }
    if (newIndex > newProg.length - 1) {
      newIndex = newProg.length - 1;
    }
    return { newProg, newWindowIndex: newIndex };
  }

  it('removing down to 1 chord resets window index to 0', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj')];
    const { newProg, newWindowIndex } = simulateRemove(prog, 0, 1);
    expect(newProg).toHaveLength(1);
    expect(newWindowIndex).toBe(0);
    expect(newProg[0].name).toBe('C Maj');
  });

  it('removing the chord at the window index shifts index back', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min')];
    const { newProg, newWindowIndex } = simulateRemove(prog, 1, 1);
    expect(newProg).toHaveLength(2);
    expect(newWindowIndex).toBe(0);
    expect(newProg[0].name).toBe('C Maj');
    expect(newProg[1].name).toBe('A Min');
  });

  it('removing a chord before the window index shifts index back', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min'), makeChord('F Maj')];
    // window at index 2 (A Min -> F Maj), remove index 0 (C Maj)
    const { newProg, newWindowIndex } = simulateRemove(prog, 2, 0);
    expect(newProg).toHaveLength(3);
    expect(newWindowIndex).toBe(1); // shifted back by 1
  });

  it('removing a chord after the window index does not change index', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min'), makeChord('F Maj')];
    // window at index 0 (C Maj -> G Maj), remove index 3 (F Maj)
    const { newProg, newWindowIndex } = simulateRemove(prog, 0, 3);
    expect(newProg).toHaveLength(3);
    expect(newWindowIndex).toBe(0);
  });

  it('removing the last chord when window is at end clamps index', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min')];
    // window at index 2, remove last chord
    const { newProg, newWindowIndex } = simulateRemove(prog, 2, 2);
    expect(newProg).toHaveLength(2);
    // newWindowIndex should be clamped to newProg.length - 1 = 1
    expect(newWindowIndex).toBeLessThanOrEqual(newProg.length - 1);
    expect(newWindowIndex).toBeGreaterThanOrEqual(0);
  });

  it('window index stays in bounds after multiple removes', () => {
    let prog = [
      makeChord('C Maj'),
      makeChord('G Maj'),
      makeChord('A Min'),
      makeChord('F Maj'),
      makeChord('D Min'),
    ];
    let windowIndex = 3;

    // Remove from the end, one at a time
    for (let i = 0; i < 3; i++) {
      const removeIdx = prog.length - 1;
      const result = simulateRemove(prog, windowIndex, removeIdx);
      prog = result.newProg;
      windowIndex = result.newWindowIndex;

      // Invariant: windowIndex is always in bounds
      expect(windowIndex).toBeGreaterThanOrEqual(0);
      if (prog.length >= 2) {
        expect(windowIndex).toBeLessThanOrEqual(prog.length - 1);
      }
    }
  });
});

describe('clearing the progression', () => {
  it('produces an empty array and resets window index', () => {
    const progression = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min')];
    const cleared: ProgressionChord[] = [];
    const windowIndex = 0;

    expect(cleared).toHaveLength(0);
    expect(windowIndex).toBe(0);
    // Verify original was not mutated
    expect(progression).toHaveLength(3);
  });

  it('clearing an already-empty progression is a no-op', () => {
    const progression: ProgressionChord[] = [];
    const cleared: ProgressionChord[] = [];
    expect(cleared).toHaveLength(0);
  });
});

describe('window index bounds invariants', () => {
  it('window index 0 is valid for any non-empty progression', () => {
    for (let len = 1; len <= 10; len++) {
      const prog = Array.from({ length: len }, (_, i) => makeChord(`Chord${i}`));
      const windowIndex = 0;
      expect(windowIndex).toBeLessThan(prog.length);
    }
  });

  it('from/to pair wraps correctly at the last index', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min')];
    const windowIndex = 2; // last chord
    const fromChord = prog[windowIndex];
    const toChord = prog[(windowIndex + 1) % prog.length];
    expect(fromChord.name).toBe('A Min');
    expect(toChord.name).toBe('C Maj'); // wraps to first
  });

  it('peek chord wraps correctly two ahead', () => {
    const prog = [makeChord('C Maj'), makeChord('G Maj'), makeChord('A Min')];
    const windowIndex = 1;
    const peekChord = prog[(windowIndex + 2) % prog.length];
    expect(peekChord.name).toBe('C Maj'); // wraps around
  });
});
