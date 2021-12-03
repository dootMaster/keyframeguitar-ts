import { useEffect, useState } from 'react';
import './App.css';
import createFretboard from './components/fretboard/helpers/createFretboard';
import Fretboard from './components/fretboard/Fretboard';
import { flat, sharp, both } from './components/fretboard/helpers/stringDict';
import InputForm from './components/form/InputForm'
import { updateFretboardViaToggle, updateFretboardViaForm } from './components/appHelpers/appHelpers';
import TuningForm from './components/form/TuningForm';

function App() {
  const [fretboard, setFretboard] = useState(createFretboard([4, 11, 7, 2, 9, 4]));
  const [accidental, setAccidental] = useState('b'); //flat
  const [currentForm, setCurrent] = useState(new Array(12).fill(false));
  const [targetForm, setTarget] = useState(new Array(12).fill(false));

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
      <button onClick={() => switchAccidental()}>switch accidental</button>
      <div className='formsContainer'>
        <InputForm
          accidental={accidental}
          form={currentForm}
          setForm={setCurrent}
        />
        <InputForm
          accidental={accidental}
          form={targetForm}
          setForm={setTarget}
        />
        <TuningForm
          accidental={accidental}
          setFretboard={setFretboard}
          fretboard={fretboard}
          currentForm={currentForm}
          targetForm={targetForm}
        />
      </div>
    </div>
  );
}

export default App;
