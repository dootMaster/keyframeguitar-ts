import { SelectNoteProps } from "./TuningModalTypes/TuningModalTypes";

const SelectNote = ({currentNote, labels, position, handleTuningChange}:SelectNoteProps) => {
  return (
    <select defaultValue={currentNote} onChange={(e) => handleTuningChange(e, position)}>
      <option value={0}>{labels[0]}</option>
      <option value={1}>{labels[1]}</option>
      <option value={2}>{labels[2]}</option>
      <option value={3}>{labels[3]}</option>
      <option value={4}>{labels[4]}</option>
      <option value={5}>{labels[5]}</option>
      <option value={6}>{labels[6]}</option>
      <option value={7}>{labels[7]}</option>
      <option value={8}>{labels[8]}</option>
      <option value={9}>{labels[9]}</option>
      <option value={10}>{labels[10]}</option>
      <option value={11}>{labels[11]}</option>
    </select>
  )
}

export default SelectNote;