import { SelectNoteProps } from "./TuningModalTypes/TuningModalTypes";

const SelectNote = ({currentNote, labels, position, handleTuningChange}:SelectNoteProps) => {

  return (
    <select value={currentNote} onChange={(e) => handleTuningChange(e, position)} className='select-note'>
      {Array.from(Array(12).keys()).map((num) => {
        return (
          <option value={num} key={`string ${position}, ${labels[num]}`}>{labels[num]}</option>
        )
      })}
    </select>
  )
}

export default SelectNote;