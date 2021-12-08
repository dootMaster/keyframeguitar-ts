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
import SaveModal from './components/SaveModal/SaveModal';

function App() {
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]);
  const [fretboard, setFretboard] = useState<GtrString[][]>(createFretboard([4, 11, 7, 2, 9, 4]));
  const [globalAccidental, setGlobalAccidental] = useState<string>('b');
  const [currentForm, setCurrent] = useState<boolean[]>(new Array(12).fill(false));
  const [targetForm, setTarget] = useState<boolean[]>(new Array(12).fill(false));
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveFileList, setSaveFileList] = useState<string[]>(Object.keys(localStorage).filter(item => item !== 'loglevel'));

  const toggleFret = (string:number, fret:number) => {
    let copy = [...fretboard];
    updateFretboardViaToggle(copy, string, fret);
    setFretboard(copy);
  }

  const switchAccidental = () => {
    switch(globalAccidental) {
      case 'b':
        setGlobalAccidental('#');
        break;
      case '#':
        setGlobalAccidental('*');
        break;
      case '*':
        setGlobalAccidental('b');
    }
  }

  const save = (name:string) => {
    if (name.length > 32 || name.length <= 0 || Object.keys(localStorage).includes('name')) {
      alert('1-32 char, or name already exists');
    } else {
      let saveObject = {
        fretboard: fretboard,
        tuning: tuning,
        currentForm: currentForm,
        targetForm: targetForm,
      };
      let saveData = JSON.stringify(saveObject)
      localStorage.setItem(name, saveData);
      setSaveFileList(Object.keys(localStorage).filter(item => item !== 'loglevel'));
    }
  }

  const load = (name:string) => {
    let loadData = JSON.parse(localStorage.getItem(name) || '');
    let { fretboard, tuning, currentForm, targetForm } = loadData;
    setFretboard(fretboard);
    setTuning(tuning);
    setCurrent(currentForm);
    setTarget(targetForm);
  }

  const deleteData = (name:string) => {
    localStorage.removeItem(name);
    setSaveFileList(Object.keys(localStorage).filter(item => item !== 'loglevel'));
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

  const toggleSaveModal = () => {
    setShowSaveModal(!showSaveModal);
  }

  return (
    <div className="App">
      <h3>Key Frame Guitar</h3>
      <h5>I built this app to help students of the guitar focus on navigating a specific chord change. I hope that you find it useful. - Leslie</h5>
      <Fretboard
        fretboard={fretboard}
        globalAccidental={globalAccidental}
        flat={flat}
        sharp={sharp}
        both={both}
        toggleFret={toggleFret}
      />
      <div className='forms-container'>
        <InputForm
          globalAccidental={globalAccidental}
          form={currentForm}
          setForm={setCurrent}
          cssAppend={'current'}
          fretboard={fretboard}
          currentForm={currentForm}
          targetForm={targetForm}
          setFretboard={setFretboard}
        />
        <div className="vl"></div>
        <InputForm
          globalAccidental={globalAccidental}
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
             tuning={tuning}
            setFretboard={setFretboard}
            fretboard={fretboard}
            currentForm={currentForm}
            targetForm={targetForm}
            setTuning={setTuning}
          />
          <br/>
          <button className='acc-button button' onClick={switchAccidental}>{'♭ ♯ ✶'}</button>
          <br/>
          <button className='show-save-modal-button' onClick={toggleSaveModal}>{'🖫'}</button>
          <br/>
          <button className='show-tuning-button' onClick={toggleTuningModal}>{'⑂'}</button>
          <br/>
          <button onClick={reset} className='reset-button button'>RESET</button>
        </div>
      </div>
      <TuningModal
        handleClose={toggleTuningModal}
        setTuning={setTuning}
        setFretboard={setFretboard}
        show={showTuningModal}
        tuning={tuning}
        globalAccidental={globalAccidental}
        currentForm={currentForm}
        targetForm={targetForm}
      />
      <SaveModal
        handleClose={toggleSaveModal}
        save={save}
        load={load}
        deleteData={deleteData}
        show={showSaveModal}
        saveFileList={saveFileList}
      />
      <footer>
        <p>P.S. I'm looking for entry level web development work. Here's my <a href='https://https://dootmaster.github.io/portfolio/'>portfolio</a>.</p>
      </footer>
    </div>
  );
}

export default App;
