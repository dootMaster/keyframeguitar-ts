import { useState } from 'react';
import { flats } from '../form/helpers/notes';
import { chordToForm } from '../form/helpers/chords';
import { presets, Preset } from '../form/helpers/presets';
import '../../CSS/PresetSelector.css';

type Props = {
  onLoadPreset: (chords: { name: string; form: boolean[] }[]) => void;
  saveFileList: string[];
  onLoadSave: (name: string) => void;
  onDeleteSave: (name: string) => void;
  activeName: string | null;
  setActiveName: (name: string | null) => void;
};

function getInitialView(): 'songs' | 'saves' {
  return localStorage.getItem('kfg:presetView') === 'saves' ? 'saves' : 'songs';
}

export default function PresetSelector({ onLoadPreset, saveFileList, onLoadSave, onDeleteSave, activeName, setActiveName }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'songs' | 'saves'>(getInitialView);
  const [keyOverride, setKeyOverride] = useState<number | null>(null);

  const switchView = (v: 'songs' | 'saves') => {
    setView(v);
    localStorage.setItem('kfg:presetView', v);
  };

  const buildProgression = (preset: Preset) => {
    const key = keyOverride !== null ? keyOverride : preset.defaultKey;
    return preset.chords.map(chord => {
      const root = (key + chord.interval) % 12;
      return {
        name: flats[root] + ' ' + chord.quality,
        form: chordToForm(root, chord.intervals),
      };
    });
  };

  const foundational = presets.filter(p => p.category === 'foundational');
  const songs = presets.filter(p => p.category === 'song');

  return (
    <div className="preset-selector">
      <button className="preset-toggle" onClick={() => setOpen(!open)}>
        <span>{activeName ? activeName : 'Presets'}</span>
        <span className="preset-chevron">{open ? '\u25BE' : '\u25B8'}</span>
      </button>
      {open && (
        <div className="preset-body">
          <div className="preset-view-tabs">
            <button
              className={'preset-view-tab' + (view === 'songs' ? ' active' : '')}
              onClick={() => switchView('songs')}
            >Songs</button>
            <button
              className={'preset-view-tab' + (view === 'saves' ? ' active' : '')}
              onClick={() => switchView('saves')}
            >My Saves</button>
          </div>

          {view === 'songs' && (
            <>
              <div className="preset-key-row">
                <label className="preset-key-label">Key</label>
                <select
                  className="preset-key-select"
                  value={keyOverride !== null ? keyOverride : ''}
                  onChange={(e) => setKeyOverride(e.target.value === '' ? null : Number(e.target.value))}
                >
                  <option value="">Original</option>
                  {flats.map((note, i) => (
                    <option key={i} value={i}>{note}</option>
                  ))}
                </select>
              </div>
              <div className="preset-group">
                <span className="preset-group-label">Foundations</span>
                {foundational.map((p, i) => (
                  <button key={i} className="preset-btn" onClick={() => { onLoadPreset(buildProgression(p)); setActiveName(p.name); setOpen(false); }}>
                    <span className="preset-name">{p.name}</span>
                    <span className="preset-key-badge">
                      {flats[keyOverride !== null ? keyOverride : p.defaultKey]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="preset-group">
                <span className="preset-group-label">Songs</span>
                {songs.map((p, i) => (
                  <button key={i} className="preset-btn" onClick={() => { onLoadPreset(buildProgression(p)); setActiveName(p.name); setOpen(false); }}>
                    <span className="preset-name">
                      {p.name}
                      {p.artist && <span className="preset-artist"> &mdash; {p.artist}</span>}
                    </span>
                    <span className="preset-key-badge">
                      {flats[keyOverride !== null ? keyOverride : p.defaultKey]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {view === 'saves' && (
            <div className="preset-saves">
              {saveFileList.length === 0 && (
                <span className="preset-saves-empty">No saved progressions yet</span>
              )}
              {saveFileList.map((name, i) => (
                <div key={i} className="preset-save-item">
                  <button className="preset-save-btn" onClick={() => { onLoadSave(name); setActiveName(name); setOpen(false); }}>
                    {name}
                  </button>
                  <button className="preset-save-delete" onClick={() => onDeleteSave(name)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
