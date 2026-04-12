import './CSS/App.css';
import { useState, useMemo, useEffect, useRef } from 'react';
import ChordSelector from './components/form/ChordSelector'
import Fretboard from './components/fretboard/Fretboard';
import createFretboard from './components/fretboard/helpers/createFretboard';
import { updateFretboardViaForm } from './components/form/helpers/formHelpers';
import { flat, sharp } from './components/fretboard/helpers/stringDict';
import { flats, sharps, renotate } from './components/form/helpers/notes';
import { GtrString } from './components/AppTypes';
import TuningModal from './components/TuningModal/TuningModal';
import SaveModal from './components/SaveModal/SaveModal';
import Progression from './components/Progression/Progression';
import { ProgressionChord } from './components/Progression/Progression';
import Notes from './components/Notes/Notes';
import PresetSelector from './components/PresetSelector/PresetSelector';
import OptionsModal, { ColorConfig, DEFAULT_COLORS, COLORBLIND_COLORS } from './components/OptionsModal/OptionsModal';
import GuideModal from './components/GuideModal/GuideModal';
import { parseChordName, parseChordInfo, chordDegreeMap, guideToneMask } from './components/form/helpers/chords';
import { NoteDisplayMode } from './components/fretboard/FretboardTypes/FretboardTypes';
import * as Dialog from '@radix-ui/react-dialog';
import { Drawer } from 'vaul';

const SAVE_PREFIX = 'kfg:';

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('kfg:theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
}

function getInitialColors(): ColorConfig {
  try {
    const saved = localStorage.getItem('kfg:colors');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_COLORS;
}

function getInitialColorblind(): boolean {
  return localStorage.getItem('kfg:colorblind') === 'true';
}

function getSaveNames(): string[] {
  return Object.keys(localStorage)
    .filter(k => k.startsWith(SAVE_PREFIX))
    .map(k => k.slice(SAVE_PREFIX.length))
    .filter(name => {
      try {
        const val = JSON.parse(localStorage.getItem(SAVE_PREFIX + name) || '');
        return val && typeof val === 'object' && 'progression' in val;
      } catch { return false; }
    });
}

function App() {
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]);
  const [fretboard, setFretboard] = useState<GtrString[][]>(createFretboard([4, 11, 7, 2, 9, 4]));
  const [fromForm, setFrom] = useState<boolean[]>(new Array(12).fill(false));
  const [toForm, setTo] = useState<boolean[]>(new Array(12).fill(false));
  const [showTuningModal, setShowTuningModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [noteDisplayMode, setNoteDisplayMode] = useState<NoteDisplayMode>('off');
  const [showGuideTones, setShowGuideTones] = useState<boolean>(false);
  const [showPeek, setShowPeek] = useState<boolean>(false);
  const [saveFileList, setSaveFileList] = useState<string[]>(getSaveNames());

  const [progression, setProgression] = useState<ProgressionChord[]>([]);
  const [windowIndex, setWindowIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [scrollResetKey, setScrollResetKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [previewForm, setPreviewForm] = useState<boolean[] | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [colors, setColors] = useState<ColorConfig>(getInitialColors);
  const [colorblind, setColorblind] = useState(getInitialColorblind);
  const [soloIndex, setSoloIndex] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [useSharps, setUseSharps] = useState(() => localStorage.getItem('kfg:sharps') === 'true');
  const noteNames = useSharps ? sharps : flats;
  const [activeName, setActiveName] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const shareTimer = useRef<ReturnType<typeof setTimeout>>();

  type UndoSnapshot = { progression: ProgressionChord[]; windowIndex: number; activeName: string | null };
  const undoStack = useRef<UndoSnapshot[]>([]);
  const pushUndo = () => {
    undoStack.current.push({ progression, windowIndex, activeName });
    if (undoStack.current.length > 20) undoStack.current.shift();
  };
  const undo = () => {
    const snapshot = undoStack.current.pop();
    if (!snapshot) return;
    setProgression(snapshot.progression);
    setActiveName(snapshot.activeName);
    setSoloIndex(null);
    setPreviewForm(null);
    if (snapshot.progression.length >= 2) {
      applyWindowDirect(snapshot.windowIndex, snapshot.progression);
    } else if (snapshot.progression.length === 1) {
      applySingleChord(snapshot.progression[0]);
    } else {
      setWindowIndex(0);
    }
  };

  useEffect(() => {
    localStorage.setItem('kfg:colors', JSON.stringify(colors));
    localStorage.setItem('kfg:colorblind', String(colorblind));
  }, [colors, colorblind]);

  useEffect(() => {
    localStorage.setItem('kfg:sharps', String(useSharps));
  }, [useSharps]);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('kfg:theme', theme);
  }, [theme]);


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if (progression.length < 2) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateProgression(windowIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateProgression(windowIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [progression, windowIndex]);

  const colorPair = progression.length >= 2 ? windowIndex % 3 : 0;

  const rotatedColors = useMemo(() => {
    const trio = [colors.from, colors.to, colors.peek];
    const rotated = [...trio.slice(colorPair), ...trio.slice(0, colorPair)];
    return { from: rotated[0], to: rotated[1], peek: rotated[2], preview: colors.preview };
  }, [colors, colorPair]);

  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#ffffff"/><circle cx="11" cy="16" r="6" fill="${rotatedColors.from}"/><circle cx="21" cy="16" r="6" fill="${rotatedColors.to}"/></svg>`;
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (link) link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }, [rotatedColors.from, rotatedColors.to]);

  const peekForm: boolean[] | null = showPeek && !previewForm && soloIndex === null && progression.length >= 3
    ? progression[(windowIndex + 2) % progression.length].form
    : null;

  const applyWindow = (index: number) => {
    const fromChord = progression[index].form;
    const toChord = progression[(index + 1) % progression.length].form;
    setFrom(fromChord);
    setTo(toChord);
    let fb = createFretboard(tuning);
    updateFretboardViaForm(fb, toChord, fromChord, 'from');
    setFretboard(fb);
    setWindowIndex(index);
  };

  const toggleSolo = (index: number) => {
    setSoloIndex(soloIndex === index ? null : index);
  };

  const addToProgression = (chord: ProgressionChord) => {
    pushUndo();
    const newProg = [...progression, chord];
    setProgression(newProg);
    setPreviewForm(null);
    setSoloIndex(null);
    if (newProg.length >= 2) {
      const idx = newProg.length === 2 ? 0 : windowIndex;
      applyWindowDirect(idx, newProg);
    } else if (newProg.length === 1) {
      applySingleChord(newProg[0]);
    }
  };

  const applySingleChord = (chord: ProgressionChord, tuningOverride?: number[]) => {
    const emptyForm = new Array(12).fill(false);
    setFrom(chord.form);
    setTo(emptyForm);
    let fb = createFretboard(tuningOverride || tuning);
    updateFretboardViaForm(fb, emptyForm, chord.form, 'from');
    setFretboard(fb);
    setWindowIndex(0);
  };

  const applyWindowDirect = (index: number, prog: ProgressionChord[], tuningOverride?: number[]) => {
    const fromChord = prog[index].form;
    const toChord = prog[(index + 1) % prog.length].form;
    setFrom(fromChord);
    setTo(toChord);
    let fb = createFretboard(tuningOverride || tuning);
    updateFretboardViaForm(fb, toChord, fromChord, 'from');
    setFretboard(fb);
    setWindowIndex(index);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (!p) return;
    const chords = p.split(',').map(s => parseChordName(decodeURIComponent(s.trim()))).filter(Boolean) as ProgressionChord[];
    if (chords.length === 0) return;
    setProgression(chords);
    if (chords.length >= 2) {
      applyWindowDirect(0, chords);
    } else if (chords.length === 1) {
      applySingleChord(chords[0]);
    }
    const t = params.get('t');
    if (t) setActiveName(decodeURIComponent(t));
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const shareProgression = () => {
    if (progression.length === 0) return;
    const param = progression.map(c => encodeURIComponent(c.name)).join(',');
    let url = window.location.origin + window.location.pathname + '?p=' + param;
    if (activeName) url += '&t=' + encodeURIComponent(activeName);
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareCopied(false), 1500);
  };

  const removeFromProgression = (index: number) => {
    pushUndo();
    const newProg = progression.filter((_, i) => i !== index);
    setProgression(newProg);
    setSoloIndex(null);
    if (newProg.length < 2) {
      if (newProg.length === 1) {
        applySingleChord(newProg[0]);
      } else {
        setWindowIndex(0);
      }
      return;
    }
    let newIndex = windowIndex;
    if (index <= windowIndex) {
      newIndex = Math.max(0, windowIndex - 1);
    }
    if (newIndex > newProg.length - 1) {
      newIndex = newProg.length - 1;
    }
    applyWindowDirect(newIndex, newProg);
  };

  const clearProgression = () => {
    pushUndo();
    setProgression([]);
    setWindowIndex(0);
    setSoloIndex(null);
    setActiveName(null);
    reset();
  };

  const loadPreset = (chords: ProgressionChord[], sharps?: boolean) => {
    if (notes.length > 0) {
      if (!window.confirm('You have unsaved notes. Load anyway?')) return;
    }
    pushUndo();
    setProgression(chords);
    setPreviewForm(null);
    setNotes([]);
    setSoloIndex(null);
    if (sharps !== undefined) setUseSharps(sharps);
    if (chords.length >= 2) {
      applyWindowDirect(0, chords);
    } else if (chords.length === 1) {
      applySingleChord(chords[0]);
    } else {
      setWindowIndex(0);
    }
  };

  const navigateProgression = (index: number) => {
    if (progression.length < 2) return;
    const wrapped = ((index % progression.length) + progression.length) % progression.length;
    setSoloIndex(null);
    applyWindow(wrapped);
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
      let saveObject = { fretboard, tuning, progression, notes, useSharps };
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
      let { fretboard: loadedFretboard, tuning: loadedTuning, progression: loadedProg, notes: loadedNotes, useSharps: loadedSharps } = loadData;
      setFretboard(loadedFretboard);
      setTuning(loadedTuning);
      setNotes(loadedNotes || []);
      if (loadedSharps !== undefined) setUseSharps(loadedSharps);
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

  const fromChordName = progression.length >= 1 ? renotate(progression[windowIndex].name, noteNames) : null;
  const toChordName = progression.length >= 2 ? renotate(progression[(windowIndex + 1) % progression.length].name, noteNames) : null;
  const peekChordName = peekForm ? renotate(progression[(windowIndex + 2) % progression.length].name, noteNames) : null;

  const tuningLabel = useMemo(() => {
    return [...tuning].reverse().map(n => (useSharps ? sharp : flat)[n]).join(' ');
  }, [tuning, useSharps]);

  const commonTones: boolean[] = progression.length >= 2 && soloIndex === null
    ? progression[windowIndex].form.map((on, i) => on && progression[(windowIndex + 1) % progression.length].form[i])
    : new Array(12).fill(false);

  const emptyDegrees = new Array(12).fill(null) as (string | null)[];
  const emptyGuide = new Array(12).fill(false);
  const fromInfo = progression.length >= 1 ? parseChordInfo(progression[windowIndex].name) : null;
  const toInfo = progression.length >= 2 ? parseChordInfo(progression[(windowIndex + 1) % progression.length].name) : null;
  const fromDegrees = fromInfo ? chordDegreeMap(fromInfo.root, fromInfo.intervals) : emptyDegrees;
  const toDegrees = toInfo ? chordDegreeMap(toInfo.root, toInfo.intervals) : emptyDegrees;
  const fromGuide = fromInfo ? guideToneMask(fromInfo.root, fromInfo.intervals) : emptyGuide;
  const toGuide = toInfo ? guideToneMask(toInfo.root, toInfo.intervals) : emptyGuide;

  const cycleNoteDisplay = () => {
    setNoteDisplayMode(m => m === 'off' ? 'notes' : m === 'notes' ? 'degrees' : m === 'degrees' ? 'both' : 'off');
  };

  const formToNotes = (form: boolean[], degrees: (string | null)[], guide: boolean[]): { name: string; common: boolean; degree: string | null; isGuide: boolean }[] => {
    return form.map((on, i) => on ? { name: noteNames[i], common: commonTones[i], degree: degrees[i], isGuide: guide[i] } : null).filter(Boolean) as { name: string; common: boolean; degree: string | null; isGuide: boolean }[];
  };

  const fromNotes = progression.length >= 1 ? formToNotes(progression[windowIndex].form, fromDegrees, fromGuide) : null;
  const toNotes = progression.length >= 2 ? formToNotes(progression[(windowIndex + 1) % progression.length].form, toDegrees, toGuide) : null;

  const reset = () => {
    let resetArray = new Array(12).fill(false);
    setFrom(resetArray);
    setTo(resetArray);
    setFretboard(createFretboard(tuning));
  }

  return (
    <div className="App" style={{
      '--color-from': rotatedColors.from,
      '--color-to': rotatedColors.to,
      '--color-peek': rotatedColors.peek,
      '--color-preview': rotatedColors.preview,
    } as React.CSSProperties}>
      <div className="rotate-overlay">
        <div className="rotate-message">
          <div className="rotate-icon">&#8635;</div>
          <p>Rotate your device to landscape</p>
        </div>
      </div>
      <header className="header">
        <h3>Keyframe Guitar</h3>
        <p className="subtitle">A simple tool for visualizing one chord change at a time.</p>
      </header>
      <div className="main">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
          Select chords
        </button>
        <aside className="sidebar">
          <PresetSelector
            onLoadPreset={loadPreset}
            saveFileList={saveFileList}
            onLoadSave={load}
            onDeleteSave={deleteData}
            activeName={activeName}
            setActiveName={setActiveName}
            noteNames={noteNames}
          />
          <ChordSelector
            onAddToProgression={addToProgression}
            lastProgressionChord={progression.length > 0 ? progression[progression.length - 1].name : null}
            onPreview={setPreviewForm}
            noteNames={noteNames}
            useSharps={useSharps}
            setUseSharps={setUseSharps}
          />
        </aside>
        <Drawer.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="drawer-overlay" />
            <Drawer.Content className="drawer-content">
              <Drawer.Handle className="drawer-handle" />
              <div className="drawer-body">
                <PresetSelector
                  onLoadPreset={(chords, sharps) => { loadPreset(chords, sharps); setSidebarOpen(false); }}
                  saveFileList={saveFileList}
                  onLoadSave={(name) => { load(name); setSidebarOpen(false); }}
                  onDeleteSave={deleteData}
                  activeName={activeName}
                  setActiveName={setActiveName}
                  noteNames={noteNames}
                />
                <div className="drawer-chord-selector">
                  <ChordSelector
                    onAddToProgression={(chord) => { addToProgression(chord); setSidebarOpen(false); }}
                    lastProgressionChord={progression.length > 0 ? progression[progression.length - 1].name : null}
                    onPreview={setPreviewForm}
                    noteNames={noteNames}
                    useSharps={useSharps}
                    setUseSharps={setUseSharps}
                    stepping
                  />
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
        <div className={'center' + (soloIndex !== null ? ' solo-active' : '') + (previewForm ? ' preview-active' : '')}>
          <Fretboard
            fretboard={fretboard}
            flat={useSharps ? sharp : flat}
            toggleFret={toggleFret}
            noteDisplayMode={noteDisplayMode}
            peekForm={peekForm}
            previewForm={previewForm}
            scrollResetKey={scrollResetKey}
            fromDegrees={fromDegrees}
            toDegrees={toDegrees}
            fromGuide={fromGuide}
            toGuide={toGuide}
            showGuideTones={showGuideTones}
            soloActive={soloIndex !== null}
          />
          <Progression
            progression={progression}
            windowIndex={windowIndex}
            onRemove={removeFromProgression}
            onNavigate={navigateProgression}
            onClear={clearProgression}
            showPeek={showPeek}
            soloIndex={soloIndex}
            onSolo={toggleSolo}
            noteNames={noteNames}
            onSelectChords={() => setSidebarOpen(true)}
            onUndo={undo}
            canUndo={undoStack.current.length > 0}
          />
          {soloIndex !== null && progression.length >= 2 ? (
            <div className="chord-tones">
              <span className={soloIndex === windowIndex ? 'chord-tones-from' : 'chord-tones-to'}>
                {formToNotes(progression[soloIndex].form, soloIndex === windowIndex ? fromDegrees : toDegrees, soloIndex === windowIndex ? fromGuide : toGuide).map((n, i, arr) => {
                  const label = (noteDisplayMode === 'degrees' || noteDisplayMode === 'both') && n.degree ? n.degree : n.name;
                  const dimmed = showGuideTones && !n.isGuide;
                  return <><span key={i} className={dimmed ? 'tone-dimmed' : ''}>{label}</span>{i < arr.length - 1 ? ' \u00B7 ' : ''}</>;
                })}
              </span>
            </div>
          ) : (fromNotes || toNotes) && (
            <div className="chord-tones">
              {fromNotes && (
                <span className="chord-tones-from">
                  {fromNotes.map((n, i) => {
                    const label = (noteDisplayMode === 'degrees' || noteDisplayMode === 'both') && n.degree ? n.degree : n.name;
                    const dimmed = showGuideTones && !n.isGuide;
                    return <><span key={i} className={n.common ? 'tone-common' : dimmed ? 'tone-dimmed' : ''}>{label}</span>{i < fromNotes.length - 1 ? ' \u00B7 ' : ''}</>;
                  })}
                </span>
              )}
              {fromNotes && toNotes && <span className="chord-tones-arrow">&rarr;</span>}
              {toNotes && (
                <span className="chord-tones-to">
                  {toNotes.map((n, i) => {
                    const label = (noteDisplayMode === 'degrees' || noteDisplayMode === 'both') && n.degree ? n.degree : n.name;
                    const dimmed = showGuideTones && !n.isGuide;
                    return <><span key={i} className={n.common ? 'tone-common' : dimmed ? 'tone-dimmed' : ''}>{label}</span>{i < toNotes.length - 1 ? ' \u00B7 ' : ''}</>;
                  })}
                </span>
              )}
            </div>
          )}
          <div className="print-legend">
            <div className="legend-title">Keyframe Guitar</div>
            {activeName && <div className="legend-active-name">{activeName}</div>}
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
            <button className={'toolbar-btn' + (noteDisplayMode !== 'off' ? ' active' : '')} onClick={cycleNoteDisplay}>
              {noteDisplayMode === 'off' ? 'Notes' : noteDisplayMode === 'notes' ? 'Notes' : noteDisplayMode === 'degrees' ? 'Deg' : 'Deg+Notes'}<span className="cycle-icon"> ⟳</span>
            </button>
            <button className={'toolbar-btn' + (showGuideTones ? ' active' : '')} onClick={() => setShowGuideTones(!showGuideTones)}>3/7</button>
            <button className={'toolbar-btn peek-btn' + (showPeek ? ' active peek-btn-active' : '')} onClick={() => setShowPeek(!showPeek)}>Peek</button>
            <span className="toolbar-tip-wrap">
              <button className="toolbar-info-btn" aria-label="What is Peek">?</button>
              <span className="toolbar-tip">Peek faintly shows the next chord after the current pair so you can plan ahead. Requires 3+ chords.</span>
            </span>
            <button className='toolbar-btn' onClick={() => setShowSaveModal(true)}>Save</button>
            <button className={'toolbar-btn' + (shareCopied ? ' share-copied' : '')} onClick={shareProgression} disabled={progression.length === 0}>{shareCopied ? 'Copied!' : 'Share'}</button>
            <button className={'toolbar-btn toolbar-more-btn' + (showMoreTools ? ' active' : '')} onClick={() => setShowMoreTools(!showMoreTools)}>More</button>
          </div>
          <div className="toolbar toolbar-secondary">
            <button className='toolbar-btn' onClick={() => setShowTuningModal(true)}>Tuning</button>
            <button className='toolbar-btn' onClick={() => setShowOptionsModal(true)}>Options</button>
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
      <OptionsModal
        show={showOptionsModal}
        handleClose={() => setShowOptionsModal(false)}
        colors={colors}
        setColors={setColors}
        colorblind={colorblind}
        setColorblind={setColorblind}
      />
      <GuideModal
        show={showGuide}
        handleClose={() => setShowGuide(false)}
      />
      <Dialog.Root open={showMoreTools} onOpenChange={setShowMoreTools}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="more-modal">
            <div className="more-section">
              <button className="more-btn" onClick={() => { setShowTuningModal(true); setShowMoreTools(false); }}>Tuning</button>
              <button className="more-btn" onClick={() => { setShowOptionsModal(true); setShowMoreTools(false); }}>Options</button>
              <button className="more-btn" onClick={() => { setScrollResetKey(k => k + 1); setShowMoreTools(false); }}>Center</button>
              <button className="more-btn" onClick={() => { window.print(); setShowMoreTools(false); }}>Print</button>
            </div>
            <div className="more-section">
              <button className="more-btn" onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); setShowMoreTools(false); }}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button className="more-btn" onClick={() => { setShowGuide(true); setShowMoreTools(false); }}>Guide</button>
              <button className="more-btn" onClick={() => { setShowAbout(true); setShowMoreTools(false); }}>About</button>
              <a className="more-btn more-link" href="https://venmo.com/u/Leslie-Ngo-1" target="_blank" rel="noopener noreferrer">Tip jar</a>
            </div>
            <div className="more-section more-section-notes">
              <Notes
                notes={notes}
                onAdd={(note) => setNotes([...notes, note])}
                onRemove={(i) => setNotes(notes.filter((_, idx) => idx !== i))}
              />
            </div>
            <button className="more-btn more-reset" onClick={() => { reset(); setShowMoreTools(false); }}>RESET</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="bottom-bar">
        <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button className="about-link" onClick={() => setShowGuide(true)}>Guide</button>
        <button className="about-link" onClick={() => setShowAbout(true)}>About</button>
        <a className="tip-link" href="https://venmo.com/u/Leslie-Ngo-1" target="_blank" rel="noopener noreferrer">Tip jar</a>
      </div>
      <Dialog.Root open={showAbout} onOpenChange={setShowAbout}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="about-modal">
            <p>I taught guitar for 7 years. Every tool I found online was either paywalled, cluttered with features, or full of ads. My students just needed something simple to see how two chords connect. So I made this.</p>
            <p>I also tried to teach myself how to animate once. I have a huge appreciation for animators now. But that experience is how I came up with the idea for this tool. Keyframes.</p>
            <p>I hope this makes your journey of exploring this ridiculous instrument a little easier.</p>
            <p className="about-sign">— Leslie</p>
            <a className="about-tip" href="https://venmo.com/u/Leslie-Ngo-1" target="_blank" rel="noopener noreferrer">Buy me a coffee</a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default App;
