import '../../CSS/Progression.css';

export type ProgressionChord = { name: string; form: boolean[] };

type ProgressionProps = {
  progression: ProgressionChord[];
  windowIndex: number;
  onRemove: (index: number) => void;
  onNavigate: (index: number) => void;
  onClear: () => void;
};

export default function Progression({
  progression, windowIndex, onRemove, onNavigate, onClear
}: ProgressionProps) {
  const canPrev = windowIndex > 0;
  const canNext = windowIndex < progression.length - 2;

  if (progression.length === 0) {
    return (
      <div className="progression progression-empty">
        <span className="progression-placeholder">Add two or more chords to visualize the transitions between them</span>
      </div>
    );
  }

  return (
    <div className="progression">
      {progression.length === 1 && (
        <span className="progression-hint">Add one more chord to see the keyframes</span>
      )}
      <div className="progression-bar">
        <button
          className="progression-nav"
          onClick={() => onNavigate(windowIndex - 1)}
          disabled={!canPrev}
        >
          &lsaquo;
        </button>
        <div className="progression-pills">
          {progression.map((chord, i) => {
            let pillClass = 'progression-pill';
            if (progression.length >= 2) {
              if (i === windowIndex) pillClass += ' pill-from';
              else if (i === windowIndex + 1) pillClass += ' pill-to';
            }
            return (
              <div key={i} className={pillClass}>
                <span
                  className="pill-label"
                  onClick={() => {
                    if (i < progression.length - 1) onNavigate(i);
                    else if (i > 0) onNavigate(i - 1);
                  }}
                >
                  {chord.name}
                </span>
                <button className="pill-remove" onClick={() => onRemove(i)}>&times;</button>
              </div>
            );
          })}
        </div>
        <button
          className="progression-nav"
          onClick={() => onNavigate(windowIndex + 1)}
          disabled={!canNext}
        >
          &rsaquo;
        </button>
      </div>
      <button className="progression-clear-btn" onClick={onClear}>Clear</button>
    </div>
  );
}
