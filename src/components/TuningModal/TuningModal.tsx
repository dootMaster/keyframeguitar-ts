import React, { useEffect } from 'react';
import SelectNote from './SelectNote';
import '../../CSS/TuningModal.css';
import { TuningModalProps } from './TuningModalTypes/TuningModalTypes';
import { flats } from '../form/helpers/notes';
import createFretboard from '../fretboard/helpers/createFretboard';
import { updateFretboardViaForm } from '../form/helpers/formHelpers';

const presets: { [key: number]: { name: string, tuning: number[] }[] } = {
  4: [
    { name: 'Bass Guitar', tuning: [7, 2, 9, 4] },
    { name: 'Violin', tuning: [4, 9, 2, 7] },
    { name: 'Ukulele', tuning: [9, 4, 0, 7] },
    { name: 'Cello', tuning: [9, 2, 7, 0] },
  ],
  5: [
    { name: 'Standard', tuning: [7, 2, 9, 4, 11] },
  ],
  6: [
    { name: 'Standard', tuning: [4, 11, 7, 2, 9, 4] },
    { name: 'Drop D', tuning: [4, 11, 7, 2, 9, 2] },
    { name: 'Open G', tuning: [2, 11, 7, 2, 7, 2] },
    { name: 'Open D', tuning: [2, 9, 6, 2, 9, 2] },
    { name: 'DADGAD', tuning: [2, 9, 7, 2, 9, 2] },
    { name: 'Open E', tuning: [4, 11, 8, 4, 11, 4] },
    { name: 'Half Step Down', tuning: [3, 10, 6, 1, 8, 3] },
  ],
  7: [
    { name: 'Standard', tuning: [4, 11, 7, 2, 9, 4, 11] },
    { name: 'Drop A', tuning: [4, 11, 7, 2, 9, 4, 9] },
  ],
  8: [
    { name: 'Standard', tuning: [4, 11, 7, 2, 9, 4, 11, 6] },
  ],
  9: [
    { name: 'Standard', tuning: [4, 11, 7, 2, 9, 4, 11, 6, 1] },
  ],
};

// Default tuning for each string count (the "Standard" preset)
function getDefaultTuning(count: number): number[] {
  const standard = presets[count];
  return standard ? standard[0].tuning : [4, 11, 7, 2, 9, 4];
}

const TuningModal = ({ handleClose, show, tuning, fretboard, setTuning, setFretboard, fromForm, toForm }: TuningModalProps) => {

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, handleClose]);

  if (!show) return null;

  const currentPresets = presets[tuning.length] || [];

  const applyTuning = (newTuning: number[]) => {
    setTuning(newTuning);
    let newFretboard = createFretboard(newTuning);
    updateFretboardViaForm(newFretboard, toForm, fromForm, 'from');
    setFretboard(newFretboard);
  };

  const changeStringCount = (newCount: number) => {
    let newTuning: number[];
    let defaultTuning = getDefaultTuning(newCount);

    if (newCount <= tuning.length) {
      newTuning = tuning.slice(0, newCount);
    } else {
      newTuning = [...tuning, ...defaultTuning.slice(tuning.length)];
    }

    setTuning(newTuning);

    let newFretboard = newTuning.map((note, i) => {
      if (i < tuning.length && tuning[i] === note) {
        return fretboard[i];
      }
      let freshString = createFretboard([note])[0];
      updateFretboardViaForm([freshString], toForm, fromForm, 'from');
      return freshString;
    });
    setFretboard(newFretboard);
  };

  const handleTuningChange = (event: React.ChangeEvent<HTMLSelectElement>, position: number) => {
    let newTuning = [...tuning];
    newTuning[position] = parseInt(event.target.value);
    setTuning(newTuning);

    let newFretboard = newTuning.map((note, i) => {
      if (i === position) {
        let freshString = createFretboard([note])[0];
        updateFretboardViaForm([freshString], toForm, fromForm, 'from');
        return freshString;
      }
      return fretboard[i];
    });
    setFretboard(newFretboard);
  };

  const stringLabels = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

  return (
    <div className="tuning-overlay" onClick={() => handleClose()}>
      <div className="tuning-modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="tuning-title">Tuning</h4>

        <div className="tuning-string-count">
          <span className="tuning-string-count-label">Strings</span>
          <div className="tuning-string-count-btns">
            {[4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                className={'tuning-count-btn' + (tuning.length === n ? ' active' : '')}
                onClick={() => changeStringCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {currentPresets.length > 0 && (
          <div className="tuning-presets">
            {currentPresets.map((preset) => (
              <button
                key={preset.name}
                className={'tuning-preset-btn' + (JSON.stringify(preset.tuning) === JSON.stringify(tuning) ? ' active' : '')}
                onClick={() => applyTuning(preset.tuning)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}

        <div className="tuning-list">
          {tuning.map((note, i) => (
            <div className="tuning-row" key={i}>
              <span className="tuning-label">{stringLabels[i]}</span>
              <SelectNote
                currentNote={note}
                labels={flats}
                position={i}
                handleTuningChange={handleTuningChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TuningModal;
