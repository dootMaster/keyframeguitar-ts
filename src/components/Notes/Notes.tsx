import { useState, ChangeEvent } from 'react';
import '../../CSS/Notes.css';

interface NotesProps {
  notes: string[];
  onAdd: (note: string) => void;
  onRemove: (index: number) => void;
}

const Notes = ({ notes, onAdd, onRemove }: NotesProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return;
    onAdd(trimmed);
    setInput('');
  };

  return (
    <div className="notes">
      <button className="notes-toggle" onClick={() => setOpen(!open)}>
        <span>Notes{notes.length > 0 ? ` (${notes.length})` : ''}</span>
        <span className="notes-chevron">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && (
        <div className="notes-body">
          {notes.length === 0 ? (
            <p className="notes-empty">No notes yet</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note, i) => (
                <li key={i} className="notes-item">
                  <span className="notes-bullet">&bull;</span>
                  <span className="notes-text">{note}</span>
                  <button className="notes-remove" onClick={() => onRemove(i)}>x</button>
                </li>
              ))}
            </ul>
          )}
          <div className="notes-add">
            <input
              className="notes-input"
              type="text"
              placeholder="Add a note..."
              value={input}
              maxLength={120}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button className="notes-add-btn" onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
