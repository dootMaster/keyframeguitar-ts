import { flats, sharps, both } from './helpers/notes'
import { useEffect, useState, useCallback } from 'react';
import '../../CSS/InputForm.css';
import Checkbox from './Checkbox'
import { FormType } from './FormTypes/FormTypes';
import { updateFretboardViaForm } from './helpers/formHelpers';

const Form = ({ fretboard, appAccidental, form, setForm, setFretboard, currentForm, targetForm, cssAppend }:FormType) => {

  const [accidental, setAccidental] = useState(flats);

  // ----
  let otherForm:boolean[];
  cssAppend === 'current' ? otherForm = targetForm : otherForm = currentForm;
  // ----

  useEffect(() => {
    handleAccidental();
  })

  const handleAccidental = () => {
    switch (appAccidental) {
      case 'b':
        setAccidental(flats);
        break;
      case '#':
        setAccidental(sharps);
        break;
      default:
        setAccidental(both);
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
    {accidental.map((note, i) =>
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