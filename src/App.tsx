import React, { useState } from 'react';
import './App.css';
import createFretboard from './components/fretboard/helpers/createFretboard'
import Fretboard from './components/fretboard/Fretboard';
import { flat, sharp, both } from './components/fretboard/helpers/stringDict'

let standardTuning = [4, 9, 2, 7, 11, 4].reverse();

function App() {
  const [tuning, setTuning] = useState(standardTuning);
  const [fretboard, setFretboard] = useState(createFretboard(tuning));
  const [accidental, setAccidental] = useState('flat');
  const [currentForm, setCurrent] = useState([]);
  const [targetForm, setTarget] = useState([]);

  console.log(fretboard)

  const toggleFret = (string: number, fret: number) => {
    let copy = [...fretboard];
    switch(copy[string][fret].display) {
      case 'neutral':
        copy[string][fret].display = 'current';
        break;
      case 'current':
        copy[string][fret].display = 'target';
        break;
      case 'target':
        copy[string][fret].display = 'neutral';
        break;
    }
    setFretboard(copy);
  }

  const switchAccidental = () => {
    switch(accidental) {
      case 'flat':
        setAccidental('sharp');
        break;
      case 'sharp':
        setAccidental('both');
        break;
      case 'both':
        setAccidental('flat');
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
    </div>
  );
}

export default App;


// {fretboard.map((string, i) => {
//   return <div>{string.map((fret, j) => {
//     return <span className={fret.display + ` fret`} onClick={() => toggleFret(i, j)}>
//       {accidental === 'flat' ? flat[fret.dictIndex] : accidental === 'sharp' ? sharp[fret.dictIndex] : both[fret.dictIndex]}
//       </span>})}
//     </div>})}
