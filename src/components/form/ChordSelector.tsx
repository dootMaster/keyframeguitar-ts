import { useState } from 'react';
import { flats, renotate } from './helpers/notes';
import { sections, scaleSections, chordToForm } from './helpers/chords';
import '../../CSS/ChordSelector.css';

type ChordSelectorProps = {
  onAddToProgression: (chord: { name: string; form: boolean[] }) => void;
  lastProgressionChord: string | null;
  onPreview: (form: boolean[] | null) => void;
  noteNames: string[];
  useSharps: boolean;
  setUseSharps: (v: boolean) => void;
  stepping?: boolean;
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
  onAddToProgression, lastProgressionChord, onPreview, noteNames, useSharps, setUseSharps, stepping
}: ChordSelectorProps) {
  const [root, setRoot] = useState(0);
  const [rootPicked, setRootPicked] = useState(!stepping);
  const [tabPicked, setTabPicked] = useState(!stepping);
  const [lastQuality, setLastQuality] = useState<{ name: string; intervals: number[]; rootOverride?: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [openModes, setOpenModes] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('tri');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const handleQualityClick = (name: string, intervals: number[], e: React.MouseEvent, rootOverride?: number) => {
    const effectiveRoot = rootOverride !== undefined ? rootOverride : root;
    const form = chordToForm(effectiveRoot, intervals);
    const chordName = flats[effectiveRoot] + ' ' + name;
    const chord = { name: chordName, form };

    if (e.shiftKey) {
      if (chordName !== lastProgressionChord) onAddToProgression(chord);
      return;
    }

    if (selected === name) {
      onPreview(null);
      setLastQuality(null);
      setSelected(null);
      return;
    }

    onPreview(form);
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

  const isDuplicate = stepping && lastChord && lastChord.name === lastProgressionChord;

  const addLastToSong = () => {
    if (!canAdd) return;
    onAddToProgression(lastChord);
  };

  const resetStepping = () => {
    setRootPicked(false);
    setTabPicked(false);
    setLastQuality(null);
    setSelected(null);
    setActiveStep(1);
    onPreview(null);
  };

  const handleRootClick = (i: number) => {
    setRoot(i);
    setRootPicked(true);
    setLastQuality(null);
    setSelected(null);
    onPreview(null);
    if (stepping) setActiveStep(2);
  };

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    setTabPicked(true);
    setLastQuality(null);
    setSelected(null);
    onPreview(null);
    if (stepping) setActiveStep(3);
  };

  const qualityContent = (
    <>
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
                {q.name}{selected === q.name && <span className="quality-dismiss">&times;</span>}
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
                const name = noteNames[chordRoot] + sc.quality;
                return (
                  <button
                    key={sc.degree}
                    className={'chord-quality-btn scale-chord-btn' + (selected === sc.quality ? ' selected' : '')}
                    onClick={(e) => handleQualityClick(sc.quality, sc.chordIntervals, e, chordRoot)}
                    onContextMenu={(e) => e.preventDefault()}
                    title={sc.degree}
                  >
                    <span className="scale-degree">{sc.degree}</span>
                    {' '}{name}{selected === sc.quality && <span className="quality-dismiss">&times;</span>}
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
                    {m.name}{selected === m.name && <span className="quality-dismiss">&times;</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  const addLabel = stepping
    ? (canAdd ? `+ ${renotate(lastChord!.name, noteNames)}` : 'Select a quality')
    : (lastChord
      ? lastChord.name === lastProgressionChord
        ? `${renotate(lastChord.name, noteNames)} is already the last chord`
        : `+ Add ${renotate(lastChord.name, noteNames)} to changes`
      : 'Select a root and quality first');

  return (
    <div className={`chord-selector${stepping ? ' chord-selector-stepping' : ''}`}>
      <div className="stepping-row">
        {/* Step 1: Root */}
        <div className={'step-col' + (stepping && activeStep === 1 && !rootPicked ? ' step-waiting' : '')} data-active={!stepping || activeStep === 1 ? '' : undefined}>
          {stepping && activeStep !== 1 && (
            <button className="step-summary" onClick={() => setActiveStep(1)}>
              <span className="step-summary-label">Root</span>
              <span className="step-summary-value">{rootPicked ? noteNames[root] : '—'}</span>
            </button>
          )}
          <div className="step-content">
            <div className="root-header">
              <span className="step-label">Root</span>
              <button
                className="sharp-flat-toggle"
                onClick={() => setUseSharps(!useSharps)}
              >
                <span className={'sf-option' + (!useSharps ? ' sf-active' : '')}>b</span>
                <span className={'sf-option' + (useSharps ? ' sf-active' : '')}>#</span>
              </button>
            </div>
            <div className="chord-roots">
              {noteNames.map((note, i) => (
                <button
                  key={i}
                  className={'chord-root-btn' + (rootPicked && root === i ? ' active' : '')}
                  onClick={() => handleRootClick(i)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Category */}
        <div className={'step-col' + (stepping && activeStep === 2 && !tabPicked ? ' step-waiting' : '')} data-active={!stepping || activeStep === 2 ? '' : undefined}>
          {stepping && activeStep !== 2 && (
            <button className="step-summary" onClick={() => setActiveStep(2)}>
              <span className="step-summary-label">Category</span>
              <span className="step-summary-value">{tabPicked ? tabs.find(t => t.key === activeTab)?.label : '—'}</span>
            </button>
          )}
          <div className="step-content">
            <span className="step-label">Category</span>
            <div className="chord-tabs">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={'chord-tab' + (tabPicked && activeTab === t.key ? ' active' : '')}
                  onClick={() => handleTabClick(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Quality */}
        <div className={'step-col' + (stepping && activeStep === 3 && !selected ? ' step-waiting' : '')} data-active={!stepping || activeStep === 3 ? '' : undefined}>
          {stepping && activeStep !== 3 && (
            <button className="step-summary" onClick={() => setActiveStep(3)}>
              <span className="step-summary-label">Quality</span>
              <span className="step-summary-value">{selected || '—'}</span>
            </button>
          )}
          <div className="step-content">
            <span className="step-label">Quality</span>
            <div className="chord-tab-content">
              {qualityContent}
            </div>
          </div>
        </div>
      </div>

      {!stepping && (
        <div className="chord-hint">
          <span className="hint-shift">shift-click: add to changes</span>
        </div>
      )}
      {isDuplicate ? (
        <button
          className="add-to-song-btn added-confirmation"
          onClick={resetStepping}
        >
          Added {renotate(lastChord!.name, noteNames)} — tap to add another
        </button>
      ) : (
        <button
          className="add-to-song-btn"
          onClick={addLastToSong}
          disabled={!canAdd}
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
