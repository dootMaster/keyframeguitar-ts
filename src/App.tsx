import './CSS/App.css';
import { useEffect, useState } from 'react';
import InputForm from './components/form/InputForm'
import TuningForm from './components/form/TuningForm';
import Fretboard from './components/fretboard/Fretboard';
import createFretboard from './components/fretboard/helpers/createFretboard';
import { flat, sharp, both } from './components/fretboard/helpers/stringDict';
import { updateFretboardViaToggle, updateFretboardViaForm } from './components/appHelpers/appHelpers';

type GtrString = {
  display: string
  dictIndex: number
}

function App() {
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]);
  const [fretboard, setFretboard] = useState<GtrString[][]>(createFretboard([4, 11, 7, 2, 9, 4]));
  const [accidental, setAccidental] = useState<string>('b');
  const [currentForm, setCurrent] = useState<boolean[]>(new Array(12).fill(false));
  const [targetForm, setTarget] = useState<boolean[]>(new Array(12).fill(false));

  useEffect(() => {
    formHandler();
  }, [currentForm, targetForm])

  const toggleFret = (string:number, fret:number) => {
    let copy = [...fretboard];
    updateFretboardViaToggle(copy, string, fret);
    setFretboard(copy);
  }

  const formHandler = () => {
    let copy = [...fretboard];
    updateFretboardViaForm(copy, currentForm, targetForm);
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

  return (
    <div className="App">
      <Fretboard
        fretboard={fretboard}
        accidental={accidental}
        flat={flat}
        sharp={sharp}
        both={both}
        toggleFret={toggleFret}
      />
      <div className='formsContainer'>
        <button className='acc-button' onClick={switchAccidental}>♭<br/>♯<br/>✶</button>
        <InputForm
          accidental={accidental}
          form={currentForm}
          setForm={setCurrent}
          cssAppend={'current'}
        />
        <InputForm
          accidental={accidental}
          form={targetForm}
          setForm={setTarget}
          cssAppend={'target'}
        />
        <TuningForm
          accidental={accidental}
          setFretboard={setFretboard}
          fretboard={fretboard}
          currentForm={currentForm}
          targetForm={targetForm}
          setTuning={setTuning}
        />
        <button onClick={reset}>RESET</button>
      </div>
    </div>
  );
}

export default App;
