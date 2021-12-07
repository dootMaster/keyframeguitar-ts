import React, { useState, useEffect } from 'react';
import SelectNote from './SelectNote';
import '../../CSS/TuningModal.css';
import { TuningModalProps } from './TuningModalTypes/TuningModalTypes';
import { flats, sharps, both } from '../form/helpers/notes';
import createFretboard from '../fretboard/helpers/createFretboard';
import { updateFretboardViaForm } from '../form/helpers/formHelpers';

const TuningModal = ({ handleClose, show, tuning, globalAccidental, setTuning, setFretboard, currentForm, targetForm }:TuningModalProps) => {
  const showHideClassName = show ? "tuning-modal display-block" : "tuning-modal display-none";

  const [accidentalLabels, setAccidentalLabels] = useState(flats);

  useEffect(() => {
    handleAccidental();
  })

  const handleAccidental = () => {
    switch (globalAccidental) {
      case 'b':
        setAccidentalLabels(flats);
        break;
      case '#':
        setAccidentalLabels(sharps);
        break;
      default:
        setAccidentalLabels(both);
    }
  }

  const handleTuningChange = (event:React.ChangeEvent<HTMLSelectElement>, position:number) => {
    let copy = [...tuning];
    copy[position] = parseInt(event.target.value);
    console.log(copy, 'change index: ' + position);
    setTuning(copy);
    let newFretboard = createFretboard(copy);
    updateFretboardViaForm(newFretboard, targetForm, currentForm, 'current');
    setFretboard(newFretboard);
  }

  let copy = [...tuning].reverse();

  return (
    <div className={showHideClassName}>
      <section className="tuning-modal-main">
        {copy.map((note, i) => {
          return (
            <SelectNote
              currentNote={note}
              labels={accidentalLabels}
              position={tuning.length - i - 1}
              handleTuningChange={handleTuningChange}
            />
          )
        })}

        <button onClick={() => handleClose()}>
          {'X'}
        </button>
      </section>
    </div>
  );
};

export default TuningModal;