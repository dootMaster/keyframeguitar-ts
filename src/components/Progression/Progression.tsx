import { renotate } from '../form/helpers/notes';
import '../../CSS/Progression.css';

export type ProgressionChord = { name: string; form: boolean[] };

type ProgressionProps = {
  progression: ProgressionChord[];
  windowIndex: number;
  onRemove: (index: number) => void;
  onNavigate: (index: number) => void;
  onClear: () => void;
  showPeek: boolean;
  soloIndex: number | null;
  onSolo: (index: number) => void;
  noteNames: string[];
  onSelectChords?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
};

export default function Progression({
  progression, windowIndex, onRemove, onNavigate, onClear, showPeek, soloIndex, onSolo, noteNames, onSelectChords, onUndo, canUndo
}: ProgressionProps) {
  const canNav = progression.length >= 2;

  if (progression.length === 0) {
    return (
      <div className="progression progression-empty">
        {onSelectChords && (
          <button className="progression-add-btn" onClick={onSelectChords} aria-label="Select chords">+</button>
        )}
        <span className="progression-placeholder">Add two or more chords to visualize the transitions between them</span>
      </div>
    );
  }

  const fromIdx = windowIndex;
  const toIdx = (windowIndex + 1) % progression.length;
  const peekIdx = (windowIndex + 2) % progression.length;

  return (
    <div className="progression">
      {progression.length === 1 && (
        <span className="progression-hint">Add one more chord to see the keyframes</span>
      )}
      <div className="progression-bar">
        {onSelectChords && (
          <button className="progression-add-btn" onClick={onSelectChords} aria-label="Select chords">+</button>
        )}
        <button
          className="progression-nav"
          onClick={() => onNavigate(windowIndex - 1)}
          disabled={!canNav}
          aria-label="Previous pair"
        >
          &lsaquo;
        </button>
        <div className="progression-pills">
          {progression.map((chord, i) => {
            let pillClass = 'progression-pill';
            if (progression.length >= 2) {
              if (i === fromIdx) pillClass += ' pill-from';
              else if (i === toIdx) pillClass += soloIndex !== null ? ' pill-to pill-to-faded' : ' pill-to';
              else if (showPeek && soloIndex === null && i === peekIdx) pillClass += ' pill-peek';
            }
            return (
              <div key={i} className={pillClass}>
                <span
                  className="pill-label"
                  title={progression.length >= 2 && i === fromIdx ? (soloIndex !== null ? 'Click to unsolo' : 'Click to solo') : undefined}
                  onClick={() => {
                    if (progression.length >= 2 && i === fromIdx) {
                      onSolo(i);
                    } else {
                      onNavigate(i);
                    }
                  }}
                >
                  {renotate(chord.name, noteNames)}
                </span>
                <button className="pill-remove" onClick={() => onRemove(i)} aria-label="Remove">&times;</button>
              </div>
            );
          })}
        </div>
        <button
          className="progression-nav"
          onClick={() => onNavigate(windowIndex + 1)}
          disabled={!canNav}
          aria-label="Next pair"
        >
          &rsaquo;
        </button>
      </div>
      {onUndo && (
        <button className="progression-undo-btn" onClick={onUndo} disabled={!canUndo} aria-label="Undo">↩</button>
      )}
      <button className="progression-clear-btn" onClick={onClear}>Clear</button>
    </div>
  );
}
