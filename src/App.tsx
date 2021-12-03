import './App.css';
import { useEffect, useState } from 'react';
import InputForm from './components/form/InputForm'
import TuningForm from './components/form/TuningForm';
import Fretboard from './components/fretboard/Fretboard';
import createFretboard from './components/fretboard/helpers/createFretboard';
import { flat, sharp, both } from './components/fretboard/helpers/stringDict';
import { updateFretboardViaToggle, updateFretboardViaForm } from './components/appHelpers/appHelpers';


function App() {
  const [fretboard, setFretboard] = useState(createFretboard([4, 11, 7, 2, 9, 4]));
  const [accidental, setAccidental] = useState('b'); //flat...
  //there is no word that exists that describes the collective property of having sharps or flats
  //'key' is incorrect. accidental is the word that describes the actual 'b' or '#' character.
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
      <div className='formsContainer'>
        <button className='acc-button' onClick={() => switchAccidental()}>♭<br/>♯<br/>✶</button>
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
        />
      </div>
    </div>
  );
}

export default App;
