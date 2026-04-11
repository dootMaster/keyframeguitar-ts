import { ChangeEvent, useState, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import SaveModalTypes from './SaveModalTypes/SaveModalTypes';
import '../../CSS/SaveModal.css';

const SaveModal = ({save, load, deleteData, handleClose, show, saveFileList}:SaveModalTypes) => {
  const [saveNameText, setSaveName] = useState<string>('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, handleClose]);

  if (!show) return null;

  const handleSave = () => {
    save(saveNameText);
    setSaveName('');
  };

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <div className="save-overlay" onClick={() => handleClose()}>
        <div className="save-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h4 className="save-modal-title">Saved Configurations</h4>

        {saveFileList.length === 0 ? (
          <p className="save-empty">No saves yet</p>
        ) : (
          <ul className="save-list">
            {saveFileList.map((name) => (
              <li key={name} className="save-item">
                <span className="save-item-name" onClick={() => load(name)}>{name}</span>
                <button className="save-item-delete" onClick={() => deleteData(name)}>x</button>
              </li>
            ))}
          </ul>
        )}

        <div className="save-new">
          <input
            className="save-input"
            type="text"
            placeholder="Name..."
            value={saveNameText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSaveName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          />
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
        </div>
      </div>
    </FocusTrap>
  );
}

export default SaveModal;
