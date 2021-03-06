import { flats, sharps, both } from './helpers/notes' // consolidate checkbox data
import { useEffect, useState, useCallback } from 'react';
import '../../CSS/InputForm.css';
import Checkbox from './Checkbox'
import { FormType } from './FormTypes/FormTypes';
import { updateFretboardViaForm } from './helpers/formHelpers';

const Form = ({ fretboard, globalAccidental, form, setForm, setFretboard, currentForm, targetForm, cssAppend }:FormType) => {

  const [noteLabels, setNoteLabels] = useState(flats);

  // ---- this doesn't need to be evaluated each re-render, but how can we avoid?
  let otherForm:boolean[];
  cssAppend === 'current' ? otherForm = targetForm : otherForm = currentForm;
  // ----

  // is this misusing useEffect? this also doesn't need to be watched every render.
  useEffect(() => {
    handleAccidental();
  })

  const handleAccidental = () => {
    switch (globalAccidental) {
      case 'b':
        setNoteLabels(flats);
        break;
      case '#':
        setNoteLabels(sharps);
        break;
      default:
        setNoteLabels(both);
    }
  }

  const handleChange = useCallback((position:number) => {
    const updatedNotesState = form.map((item, index) => index === position ? !item : item);
    setForm(updatedNotesState);


    let copy = [...fretboard]
    updateFretboardViaForm(copy, otherForm, updatedNotesState, cssAppend);
    setFretboard(copy);
  }, [cssAppend, form, fretboard, setForm, setFretboard, otherForm])

  return (
    <form className={'input-form-' + cssAppend}>
    {noteLabels.map((note, i) =>
        (
          <div key={i} className='checkbox-bg'>
            <Checkbox
              i={i}
              note={note}
              handleChange={handleChange}
              cssAppend={cssAppend}
              checked={form[i]}
            />
            <label htmlFor={note + cssAppend} className='checkbox-label'>{note}</label><br/>
          </div>
        )
      )
    }
    </form>
  )
}

export default Form;