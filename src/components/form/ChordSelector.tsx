import { useState } from 'react';
import { flats } from './helpers/notes';
import { updateFretboardViaForm } from './helpers/formHelpers';
import { sections, scaleSections, chordToForm } from './helpers/chords';
import '../../CSS/ChordSelector.css';

type ChordSelectorProps = {
  fromForm: boolean[];
  toForm: boolean[];
  setFrom: (form: boolean[]) => void;
  setTo: (form: boolean[]) => void;
  fretboard: { display: string; dictIndex: number }[][];
  setFretboard: (fb: { display: string; dictIndex: number }[][]) => void;
  onAddToProgression: (chord: { name: string; form: boolean[] }) => void;
  lastProgressionChord: string | null;
};

const tabs = [
  { key: 'tri', label: 'Triad' },
  { key: '7th', label: '7th' },
  { key: 'ext', label: 'Ext' },
  { key: 'alt', label: 'Alt' },
  { key: 'pent', label: 'Pent' },
  { key: 'maj', label: 'Maj' },
  { key: 'mel', label: 'Mel' },
  { key: 'har', label: 'Har' },
] as const;

type TabKey = typeof tabs[number]['key'];

const tabToSection: Record<TabKey, string> = {
  tri: 'Triads',
  '7th': 'Sevenths',
  ext: 'Extended',
  alt: 'Altered',
  pent: 'Pentatonic / Blues',
  maj: 'Major Scale',
  mel: 'Melodic Minor',
  har: 'Harmonic Minor',
};

export default function ChordSelector({
  fromForm, toForm, setFrom, setTo, fretboard, setFretboard, onAddToProgression, lastProgressionChord
}: ChordSelectorProps) {
  const [root, setRoot] = useState(0);
  const [lastQuality, setLastQuality] = useState<{ name: string; intervals: number[]; rootOverride?: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [openModes, setOpenModes] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('tri');

  const handleQualityClick = (name: string, intervals: number[], e: React.MouseEvent, rootOverride?: number) => {
    const effectiveRoot = rootOverride !== undefined ? rootOverride : root;
    const form = chordToForm(effectiveRoot, intervals);
    const chordName = flats[effectiveRoot] + ' ' + name;
    const chord = { name: chordName, form };

    if (e.shiftKey) {
      if (chordName !== lastProgressionChord) onAddToProgression(chord);
      return;
    }

    setFrom(form);
    let copy = [...fretboard];
    updateFretboardViaForm(copy, toForm, form, 'from');
    setFretboard(copy);
    setLastQuality({ name, intervals, rootOverride });
    setSelected(name);
  };

  // Derive current chord from lastQuality + current root (reacts to root changes)
  const lastChord = lastQuality ? (() => {
    const effectiveRoot = lastQuality.rootOverride !== undefined ? lastQuality.rootOverride : root;
    const form = chordToForm(effectiveRoot, lastQuality.intervals);
    const chordName = flats[effectiveRoot] + ' ' + lastQuality.name;
    return { name: chordName, form };
  })() : null;

  const canAdd = lastChord && lastChord.name !== lastProgressionChord;

  const addLastToSong = () => {
    if (canAdd) onAddToProgression(lastChord);
  };

  return (
    <div className="chord-selector">
      <span className="step-label">1. Root</span>
      <div className="chord-roots">
        {flats.map((note, i) => (
          <button
            key={i}
            className={'chord-root-btn' + (root === i ? ' active' : '')}
            onClick={() => { setRoot(i); setLastQuality(null); setSelected(null); }}
          >
            {note}
          </button>
        ))}
      </div>
      <span className="step-label">2. Category</span>
      <div className="chord-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={'chord-tab' + (activeTab === t.key ? ' active' : '')}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <span className="step-label">3. Quality</span>
      <div className="chord-tab-content">
        {sections.filter(s => s.label === tabToSection[activeTab]).map((section) => (
          <div key={section.label} className="chord-section">
            <div className="chord-section-items">
              {section.items.map((q) => (
                <button
                  key={q.name}
                  className={'chord-quality-btn' + (selected === q.name ? ' selected' : '')}
                  onClick={(e) => handleQualityClick(q.name, q.intervals, e)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {q.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        {scaleSections.filter(s => s.label === tabToSection[activeTab]).map((section) => {
          const modesOpen = openModes[section.label] || false;
          return (
            <div key={section.label} className="chord-section scale-section">
              <div className="chord-section-items">
                {section.chords.map((sc) => {
                  const chordRoot = (root + sc.interval) % 12;
                  const name = flats[chordRoot] + sc.quality;
                  return (
                    <button
                      key={sc.degree}
                      className={'chord-quality-btn scale-chord-btn' + (selected === sc.quality ? ' selected' : '')}
                      onClick={(e) => handleQualityClick(sc.quality, sc.chordIntervals, e, chordRoot)}
                      onContextMenu={(e) => e.preventDefault()}
                      title={sc.degree}
                    >
                      <span className="scale-degree">{sc.degree}</span>
                      {' '}{name}
                    </button>
                  );
                })}
              </div>
              <button
                className={'modes-toggle' + (modesOpen ? ' open' : '')}
                onClick={() => setOpenModes({ ...openModes, [section.label]: !modesOpen })}
              >
                Modes {modesOpen ? '▾' : '▸'}
              </button>
              {modesOpen && (
                <div className="chord-section-items modes-items">
                  {section.modes.map((m) => (
                    <button
                      key={m.name}
                      className={'chord-quality-btn mode-btn' + (selected === m.name ? ' selected' : '')}
                      onClick={(e) => handleQualityClick(m.name, m.intervals, e)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="chord-hint">
        <span className="hint-shift">shift-click: add to changes</span>
      </div>
      <span className="step-label">4. Add</span>
      <button
        className="add-to-song-btn"
        onClick={addLastToSong}
        disabled={!canAdd}
      >
        {lastChord ? `+ Add ${lastChord.name} to changes` : '+ Add to changes'}
      </button>
    </div>
  );
}
