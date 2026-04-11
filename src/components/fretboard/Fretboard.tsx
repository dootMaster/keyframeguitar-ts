import { useRef, useEffect, useCallback } from 'react';
import String from './GtrString'
import '../../CSS/Fretboard.css';
import { FretboardProps } from './FretboardTypes/FretboardTypes';

// One visible octave = 13 columns (fret 0-12). Each extra octave adds 12 columns
// (fret 12 of one octave IS fret 0 of the next — no duplicate).
// 5 visual octaves: 13 + 4*12 = 61 columns
const VISIBLE_COLS = 13;
const OCTAVE_COLS = 12;
const BUFFER_OCTAVES = 5;
const TOTAL_COLS = VISIBLE_COLS + (BUFFER_OCTAVES - 1) * OCTAVE_COLS; // 61

const dotPattern = [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0];

function buildDots(totalCols: number): number[] {
  const dots: number[] = [];
  for (let i = 0; i < totalCols; i++) {
    if (i % 12 === 0) dots.push(i === 0 ? 0 : 2);
    else dots.push(dotPattern[i % 12]);
  }
  return dots;
}

// Map extended column index to canonical fret index (0-12)
function toCanonical(col: number): number {
  if (col <= 12) return col;
  return ((col - 1) % 12) + 1;
}

const Fretboard = (props: FretboardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dots = buildDots(TOTAL_COLS);

  // One octave shift in pixels = 12 columns worth
  const getOctaveShift = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    return (el.scrollWidth / TOTAL_COLS) * OCTAVE_COLS;
  }, []);

  // Start scrolled 2 octaves in (so there's buffer to scroll left), also reset on scrollResetKey change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = getOctaveShift() * 2;
  }, [getOctaveShift, props.scrollResetKey]);

  // Infinite loop: jump by one octave when near edges
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const shift = getOctaveShift();
    if (shift === 0) return;

    if (el.scrollLeft < shift * 0.5) {
      el.scrollLeft += shift;
    } else if (el.scrollLeft > shift * 3.5) {
      el.scrollLeft -= shift;
    }
  }, [getOctaveShift]);

  // Convert vertical wheel to horizontal scroll, snapping to fret widths
  const handleWheel = useCallback((e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      const colW = el.scrollWidth / TOTAL_COLS;
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentCol = Math.round(el.scrollLeft / colW);
      const targetCol = currentCol + direction;
      el.scrollTo({ left: targetCol * colW, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Build extended string data: fret 0, then repeating frets 1-12
  const extendedFretboard = props.fretboard.map(gtrString => {
    const extended = [];
    for (let i = 0; i < TOTAL_COLS; i++) {
      extended.push(gtrString[toCanonical(i)]);
    }
    return extended;
  });

  // Wrap toggleFret to map extended column back to canonical fret index
  const wrappedToggleFret = useCallback((string: number, col: number, isRight: boolean) => {
    props.toggleFret(string, toCanonical(col), isRight);
  }, [props.toggleFret]);

  return (
    <div className='fretboard-container'>
      <div className='fretboard-scroll' ref={scrollRef} onScroll={handleScroll}>
        <table className='fretboard' style={{ width: `${(TOTAL_COLS / VISIBLE_COLS) * 100}%` }}>
          <tbody>
            {extendedFretboard.map((gtrString, i) =>
              (
                <String
                  gtrString={gtrString}
                  i={i}
                  toggleFret={wrappedToggleFret}
                  flat={props.flat}
                  showAllNotes={props.showAllNotes}
                  peekForm={props.peekForm}
                  previewForm={props.previewForm}
                  key={i}
                />
              )
            )}
          </tbody>
          <tfoot>
            <tr className='fret-dots'>
              {dots.map((dot, i) => (
                <td key={i}>{dot === 2 ? '••' : dot === 1 ? '•' : ''}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="fretboard-hint">Scroll to explore the fretboard</div>
    </div>
  );
}

export default Fretboard;
