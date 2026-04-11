import { flats } from './helpers/notes';
import { updateFretboardViaForm } from './helpers/formHelpers';
import '../../CSS/NoteSelector.css';

type NoteSelectorProps = {
  fromForm: boolean[];
  toForm: boolean[];
  setFrom: (form: boolean[]) => void;
  setTo: (form: boolean[]) => void;
  fretboard: { display: string; dictIndex: number }[][];
  setFretboard: (fb: { display: string; dictIndex: number }[][]) => void;
};

function getState(from: boolean, to: boolean): string {
  if (from && to) return 'common';
  if (from) return 'from';
  if (to) return 'to';
  return 'neutral';
}

export default function NoteSelector({
  fromForm, toForm, setFrom, setTo, fretboard, setFretboard
}: NoteSelectorProps) {

  const handleClick = (index: number, isRight: boolean) => {
    let newFrom = [...fromForm];
    let newTo = [...toForm];

    if (isRight) {
      newTo[index] = !newTo[index];
    } else {
      newFrom[index] = !newFrom[index];
    }

    setFrom(newFrom);
    setTo(newTo);

    let copy = [...fretboard];
    updateFretboardViaForm(copy, newTo, newFrom, 'from');
    setFretboard(copy);
  };

  return (
    <div className="note-selector-wrapper">
      <div className="note-selector">
        {flats.map((note, i) => {
          const state = getState(fromForm[i], toForm[i]);
          return (
            <button
              key={i}
              className={`note-btn ${state}`}
              onClick={() => handleClick(i, false)}
              onContextMenu={(e) => { e.preventDefault(); handleClick(i, true); }}
            >
              {note}
            </button>
          );
        })}
      </div>
      <div className="note-selector-hint"><span className="hint-from">left click: from</span> &nbsp; <span className="hint-to">right click: to</span></div>
    </div>
  );
}
