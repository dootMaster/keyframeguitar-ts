import { ChangeEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import SaveModalTypes from './SaveModalTypes/SaveModalTypes';
import '../../CSS/SaveModal.css';

const SaveModal = ({save, load, deleteData, handleClose, show, saveFileList}:SaveModalTypes) => {
  const [saveNameText, setSaveName] = useState<string>('');

  const handleSave = () => {
    save(saveNameText);
    setSaveName('');
  };

  return (
    <Dialog.Root open={show} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="save-modal">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SaveModal;
