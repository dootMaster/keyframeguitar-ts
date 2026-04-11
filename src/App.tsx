import './CSS/App.css';
import { useState, useMemo, useEffect } from 'react';
import ChordSelector from './components/form/ChordSelector'
import Fretboard from './components/fretboard/Fretboard';
import createFretboard from './components/fretboard/helpers/createFretboard';
import { updateFretboardViaForm } from './components/form/helpers/formHelpers';
import { flat } from './components/fretboard/helpers/stringDict';
import { flats } from './components/form/helpers/notes';
import { GtrString } from './components/AppTypes';
import TuningModal from './components/TuningModal/TuningModal';
import SaveModal from './components/SaveModal/SaveModal';
import Progression from './components/Progression/Progression';
import { ProgressionChord } from './components/Progression/Progression';
import Notes from './components/Notes/Notes';

const SAVE_PREFIX = 'kfg:';

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('kfg:theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
}

function getSaveNames(): string[] {
  return Object.keys(localStorage)
    .filter(k => k.startsWith(SAVE_PREFIX))
    .map(k => k.slice(SAVE_PREFIX.length));
}

function App() {
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]);
  const [fretboard, setFretboard] = useState<GtrString[][]>(createFretboard([4, 11, 7, 2, 9, 4]));
  const [fromForm, setFrom] = useState<boolean[]>(new Array(12).fill(false));
  const [toForm, setTo] = useState<boolean[]>(new Array(12).fill(false));
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showAllNotes, setShowAllNotes] = useState<boolean>(false);
  const [showPeek, setShowPeek] = useState<boolean>(false);
  const [saveFileList, setSaveFileList] = useState<string[]>(getSaveNames());

  const [progression, setProgression] = useState<ProgressionChord[]>([]);
  const [windowIndex, setWindowIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [scrollResetKey, setScrollResetKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('kfg:theme', theme);
  }, [theme]);

  const colorPair = progression.length >= 2 ? windowIndex % 3 : 0;

  const peekForm: boolean[] | null = showPeek && progression.length >= 2 && windowIndex + 2 < progression.length
    ? progression[windowIndex + 2].form
    : null;

  const applyWindow = (index: number) => {
    const fromChord = progression[index].form;
    const toChord = progression[index + 1].form;
    setFrom(fromChord);
    setTo(toChord);
    let fb = createFretboard(tuning);
    updateFretboardViaForm(fb, toChord, fromChord, 'from');
    setFretboard(fb);
    setWindowIndex(index);
  };

  const addToProgression = (chord: ProgressionChord) => {
    const newProg = [...progression, chord];
    setProgression(newProg);
    if (newProg.length === 2) {
      applyWindowDirect(0, newProg);
    }
  };

  const applyWindowDirect = (index: number, prog: ProgressionChord[], tuningOverride?: number[]) => {
    const fromChord = prog[index].form;
    const toChord = prog[index + 1].form;
    setFrom(fromChord);
    setTo(toChord);
    let fb = createFretboard(tuningOverride || tuning);
    updateFretboardViaForm(fb, toChord, fromChord, 'from');
    setFretboard(fb);
    setWindowIndex(index);
  };

  const removeFromProgression = (index: number) => {
    const newProg = progression.filter((_, i) => i !== index);
    setProgression(newProg);
    if (newProg.length < 2) {
      setWindowIndex(0);
      return;
    }
    let newIndex = windowIndex;
    if (index <= windowIndex) {
      newIndex = Math.max(0, windowIndex - 1);
    }
    if (newIndex > newProg.length - 2) {
      newIndex = newProg.length - 2;
    }
    applyWindowDirect(newIndex, newProg);
  };

  const clearProgression = () => {
    setProgression([]);
    setWindowIndex(0);
  };

  const navigateProgression = (index: number) => {
    if (index < 0 || index > progression.length - 2) return;
    applyWindow(index);
  };

  const toggleFret = (string:number, fret:number, isRight:boolean) => {
    let copy = [...fretboard];
    let display = copy[string][fret].display;
    let hasFrom = display === 'from' || display === 'common';
    let hasTo = display === 'to' || display === 'common';

    if (isRight) {
      hasTo = !hasTo;
    } else {
      hasFrom = !hasFrom;
    }

    if (hasFrom && hasTo) copy[string][fret].display = 'common';
    else if (hasFrom) copy[string][fret].display = 'from';
    else if (hasTo) copy[string][fret].display = 'to';
    else copy[string][fret].display = 'neutral';

    setFretboard(copy);
  }

  const save = (name:string) => {
    if (name.length > 32 || name.length <= 0 || getSaveNames().includes(name)) {
      alert('1-32 char, or name already exists');
    } else {
      let saveObject = { fretboard, tuning, progression, notes };
      localStorage.setItem(SAVE_PREFIX + name, JSON.stringify(saveObject));
      setSaveFileList(getSaveNames());
    }
  }

  const deriveFormsFromFretboard = (fb: GtrString[][]) => {
    let from = new Array(12).fill(false);
    let to = new Array(12).fill(false);
    fb.forEach(gtrString => {
      gtrString.forEach(fret => {
        if (fret.display === 'from' || fret.display === 'common') from[fret.dictIndex] = true;
        if (fret.display === 'to' || fret.display === 'common') to[fret.dictIndex] = true;
      });
    });
    return { from, to };
  }

  const load = (name:string) => {
    if (notes.length > 0) {
      if (!window.confirm('You have unsaved notes. Load anyway?')) return;
    }
    try {
      let loadData = JSON.parse(localStorage.getItem(SAVE_PREFIX + name) || '');
      let { fretboard: loadedFretboard, tuning: loadedTuning, progression: loadedProg, notes: loadedNotes } = loadData;
      setFretboard(loadedFretboard);
      setTuning(loadedTuning);
      setNotes(loadedNotes || []);
      let { from, to } = deriveFormsFromFretboard(loadedFretboard);
      setFrom(from);
      setTo(to);
      if (loadedProg && loadedProg.length >= 2) {
        setProgression(loadedProg);
        setWindowIndex(0);
        applyWindowDirect(0, loadedProg, loadedTuning);
      } else {
        setProgression(loadedProg || []);
        setWindowIndex(0);
      }
    } catch {
      alert('Failed to load save');
    }
  }

  const deleteData = (name:string) => {
    localStorage.removeItem(SAVE_PREFIX + name);
    setSaveFileList(getSaveNames());
  }

  const fromChordName = progression.length >= 2 ? progression[windowIndex].name : null;
  const toChordName = progression.length >= 2 ? progression[windowIndex + 1].name : null;
  const peekChordName = peekForm && windowIndex + 2 < progression.length ? progression[windowIndex + 2].name : null;

  const tuningLabel = useMemo(() => {
    return [...tuning].reverse().map(n => flat[n]).join(' ');
  }, [tuning]);

  const commonTones: boolean[] = progression.length >= 2
    ? progression[windowIndex].form.map((on, i) => on && progression[windowIndex + 1].form[i])
    : new Array(12).fill(false);

  const formToNotes = (form: boolean[]): { name: string; common: boolean }[] => {
    return form.map((on, i) => on ? { name: flats[i], common: commonTones[i] } : null).filter(Boolean) as { name: string; common: boolean }[];
  };

  const fromNotes = progression.length >= 2 ? formToNotes(progression[windowIndex].form) : null;
  const toNotes = progression.length >= 2 ? formToNotes(progression[windowIndex + 1].form) : null;

  const reset = () => {
    let resetArray = new Array(12).fill(false);
    setFrom(resetArray);
    setTo(resetArray);
    setFretboard(createFretboard(tuning));
  }

  return (
    <div className="App" data-color-pair={colorPair} data-theme={theme}>
      <div className="rotate-overlay">
        <div className="rotate-message">
          <div className="rotate-icon">&#8635;</div>
          <p>Rotate your device to landscape</p>
        </div>
      </div>
      <header className="header">
        <h3>Key Frame Guitar</h3>
        <p className="subtitle">A simple tool for visualizing one chord change at a time.</p>
      </header>
      <div className="main">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? 'Hide chords' : 'Show chords'}
        </button>
        <aside className={'sidebar' + (sidebarOpen ? ' sidebar-open' : '')}>
          <ChordSelector
            fromForm={fromForm}
            toForm={toForm}
            setFrom={setFrom}
            setTo={setTo}
            fretboard={fretboard}
            setFretboard={setFretboard}
            onAddToProgression={addToProgression}
            lastProgressionChord={progression.length > 0 ? progression[progression.length - 1].name : null}
          />
        </aside>
        <div className="center">
          <Fretboard
            fretboard={fretboard}
            flat={flat}
            toggleFret={toggleFret}
            showAllNotes={showAllNotes}
            peekForm={peekForm}
            scrollResetKey={scrollResetKey}
          />
          <Progression
            progression={progression}
            windowIndex={windowIndex}
            onRemove={removeFromProgression}
            onNavigate={navigateProgression}
            onClear={clearProgression}
            showPeek={showPeek}
          />
          {(fromNotes || toNotes) && (
            <div className="chord-tones">
              {fromNotes && (
                <span className="chord-tones-from">
                  {fromChordName}:{' '}
                  {fromNotes.map((n, i) => (
                    <span key={i} className={n.common ? 'tone-common' : ''}>{n.name}{i < fromNotes.length - 1 ? '  ' : ''}</span>
                  ))}
                </span>
              )}
              {fromNotes && toNotes && <span className="chord-tones-arrow">&rarr;</span>}
              {toNotes && (
                <span className="chord-tones-to">
                  {toChordName}:{' '}
                  {toNotes.map((n, i) => (
                    <span key={i} className={n.common ? 'tone-common' : ''}>{n.name}{i < toNotes.length - 1 ? '  ' : ''}</span>
                  ))}
                </span>
              )}
            </div>
          )}
          <div className="print-legend">
            <div className="legend-title">Key Frame Guitar</div>
            <div className="legend-tuning">Tuning: {tuningLabel}</div>
            <div className="legend-items">
              {fromChordName && (
                <div className="legend-item">
                  <span className="legend-swatch legend-swatch-from"></span>
                  <span>From: {fromChordName}</span>
                </div>
              )}
              {toChordName && (
                <div className="legend-item">
                  <span className="legend-swatch legend-swatch-to"></span>
                  <span>To: {toChordName}</span>
                </div>
              )}
              {(fromChordName && toChordName) && (
                <div className="legend-item">
                  <span className="legend-swatch legend-swatch-common"></span>
                  <span>Common tones</span>
                </div>
              )}
              {peekChordName && (
                <div className="legend-item">
                  <span className="legend-swatch legend-swatch-peek"></span>
                  <span>Next: {peekChordName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="toolbar">
            <button className={'toolbar-btn' + (showAllNotes ? ' active' : '')} onClick={() => setShowAllNotes(!showAllNotes)}>Note names</button>
            <button className={'toolbar-btn' + (showPeek ? ' active peek-btn-active' : '')} onClick={() => setShowPeek(!showPeek)}>Peek</button>
            <span className="toolbar-tip-wrap">
              <button className="toolbar-info-btn">?</button>
              <span className="toolbar-tip">When enabled, the next chord after the current pair is faintly shown on the fretboard so you can plan ahead. Requires 3 or more chords in changes.</span>
            </span>
            <button className='toolbar-btn' onClick={() => setShowTuningModal(true)}>Tuning</button>
            <button className='toolbar-btn' onClick={() => setShowSaveModal(true)}>Save</button>
            <button className='toolbar-btn' onClick={() => setScrollResetKey(k => k + 1)}>Center</button>
            <button className='toolbar-btn' onClick={() => window.print()}>Print</button>
            <button className='toolbar-btn reset-button' onClick={reset}>RESET</button>
          </div>
          <Notes
            notes={notes}
            onAdd={(note) => setNotes([...notes, note])}
            onRemove={(i) => setNotes(notes.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>
      <TuningModal
        handleClose={() => setShowTuningModal(false)}
        setTuning={setTuning}
        fretboard={fretboard}
        setFretboard={setFretboard}
        show={showTuningModal}
        tuning={tuning}
        fromForm={fromForm}
        toForm={toForm}
      />
      <SaveModal
        handleClose={() => setShowSaveModal(false)}
        save={save}
        load={load}
        deleteData={deleteData}
        show={showSaveModal}
        saveFileList={saveFileList}
      />
      <div className="bottom-bar">
        <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button className="about-link" onClick={() => setShowAbout(true)}>About</button>
      </div>
      {showAbout && (
        <div className="save-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <p>I taught guitar for 7 years. Every tool I found online was either paywalled, cluttered with features, or full of ads. My students just needed something simple to see how two chords connect. So I made this.</p>
            <p>I hope this makes your journey of exploring this ridiculous instrument a little easier.</p>
            <p className="about-sign">— Leslie</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
