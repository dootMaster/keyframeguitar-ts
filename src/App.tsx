import './CSS/App.css';
import { useState } from 'react';
import InputForm from './components/form/InputForm'
import Fretboard from './components/fretboard/Fretboard';
import createFretboard from './components/fretboard/helpers/createFretboard';
import { flat, sharp, both } from './components/fretboard/helpers/stringDict';
import { updateFretboardViaToggle } from './components/appHelpers/appHelpers';
import { GtrString } from './components/AppTypes';
import StringQtySelect from './components/form/StringQtySelect';
import TuningModal from './components/TuningModal/TuningModal';

function App() {
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]);
  const [fretboard, setFretboard] = useState<GtrString[][]>(createFretboard([4, 11, 7, 2, 9, 4]));
  const [accidental, setAccidental] = useState<string>('b');
  const [currentForm, setCurrent] = useState<boolean[]>(new Array(12).fill(false));
  const [targetForm, setTarget] = useState<boolean[]>(new Array(12).fill(false));
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);

  const toggleFret = (string:number, fret:number) => {
    let copy = [...fretboard];
    updateFretboardViaToggle(copy, string, fret);
    setFretboard(copy);
  }

  const switchAccidental = () => {
    switch(accidental) {
      case 'b':
        setAccidental('#');
        break;
      case '#':
        setAccidental('*');
        break;
      case '*':
        setAccidental('b');
    }
  }

  const reset = () => {
    let resetArray = new Array(12).fill(false);
    setCurrent(resetArray);
    setTarget(resetArray);
    setFretboard(createFretboard(tuning));
  }

  const toggleTuningModal = () => {
    setShowTuningModal(!showTuningModal);
  }

  return (
    <div className="App">
      <h1>Key Frame Guitar</h1>
      <h5>I built this app to help students of the guitar focus on navigating a specific chord change. I hope that you find it useful. - Leslie</h5>
      <Fretboard
        fretboard={fretboard}
        accidental={accidental}
        flat={flat}
        sharp={sharp}
        both={both}
        toggleFret={toggleFret}
      />
      <div className='forms-container'>
        <InputForm
          appAccidental={accidental}
          form={currentForm}
          setForm={setCurrent}
          cssAppend={'current'}
          fretboard={fretboard}
          currentForm={currentForm}
          targetForm={targetForm}
          setFretboard={setFretboard}
        />
        <InputForm
          appAccidental={accidental}
          form={targetForm}
          setForm={setTarget}
          cssAppend={'target'}
          fretboard={fretboard}
          currentForm={currentForm}
          targetForm={targetForm}
          setFretboard={setFretboard}
        />
        <div className='tools-container'>
          <StringQtySelect
            accidental={accidental}
            setFretboard={setFretboard}
            fretboard={fretboard}
            currentForm={currentForm}
            targetForm={targetForm}
            setTuning={setTuning}
          />
          <br/>
          <button className='acc-button button' onClick={switchAccidental}>{'♭ ♯ ✶'}</button>
          <br/>
          <button className='show-tuning-button' onClick={toggleTuningModal}>{'⑂'}</button>
          <br/>
          <button onClick={reset} className='reset-button button'>RESET</button>
        </div>
      </div>
      <TuningModal
        handleClose={toggleTuningModal}
        show={showTuningModal}
        tuning={tuning}
      />
    </div>
  );
}

export default App;
