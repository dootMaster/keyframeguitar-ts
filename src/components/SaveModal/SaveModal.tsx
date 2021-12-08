import { ChangeEvent, useState } from 'react';
import SaveModalTypes from './SaveModalTypes/SaveModalTypes';
import '../../CSS/SaveModal.css';

const SaveModal = ({save, load, deleteData, handleClose, show, saveFileList}:SaveModalTypes) => {
  const showHideClassName = show ? "save-modal display-block" : "save-modal display-none";
  const [saveNameText, setSaveName] = useState<string>('');
  const [selectedSaveFile, setSelectedSaveFile] = useState<string>(saveFileList[0])

  let disable;
  saveFileList.length > 0 ? disable = false : disable = true;

  const handleSaveNameText = (event:ChangeEvent<HTMLInputElement>) => {
    let newText = event.target.value;
    setSaveName(newText);
  }

  const handleSaveFileSelect = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let name = event.target.value;
    setSelectedSaveFile(name);
  }

  return (
    <div className={showHideClassName}>
    <section className="save-modal-main">
      <div>
        <select className='save-select-menu' disabled={disable} value={selectedSaveFile} onChange={(e) => handleSaveFileSelect(e)}>
          {saveFileList.map((name) => {
            return (
              <option value={name} key={name}>{name}</option>
            )
          })}
        </select>
        <button onClick={() => load(selectedSaveFile)}>Load</button>
        <button onClick={() => {deleteData(selectedSaveFile); setSelectedSaveFile(saveFileList[0]);}}>Delete</button>
      </div>
      <div>
        <input className='save-name-input' type='text' value={saveNameText} onChange={(e) => handleSaveNameText(e)}></input>
        <button onClick={() => {save(saveNameText); setSelectedSaveFile(saveNameText)}}>Save</button>
      </div>
      <button onClick={() => handleClose()}>{'X'}</button>
    </section>
  </div>
  )
}

export default SaveModal;