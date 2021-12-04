import { flats, sharps, both } from './helpers/notes'
import { useEffect, useState } from 'react';
import '../../CSS/InputForm.css';
import Checkbox from './Checkbox'
import { FormType } from './FormTypes/FormTypes';

const Form = (props:FormType) => {

  const [accidental, setAccidental] = useState(flats);

  useEffect(() => {
    handleAccidental();
  })

  const handleAccidental = () => {
    if(props.accidental === 'b') setAccidental(flats);
    else if(props.accidental === '#') setAccidental(sharps);
    else setAccidental(both);
  }

  const handleChange = (position:number) => {
    const updatedNotesState = props.form.map((item, index) => index === position ? !item : item);
    props.setForm(updatedNotesState);
  }

  return (
    <form className={'input-form-' + props.cssAppend}>
    {accidental.map((note, i) =>
        (
          <div key={i} className='checkbox-bg'>
            <Checkbox
              i={i}
              note={note}
              handleChange={handleChange}
              cssAppend={props.cssAppend}
              checked={props.form[i]}
            />
            <label htmlFor={note + props.cssAppend} className='checkbox-label'>{note}</label><br/>
          </div>
        )
      )
    }
    </form>
  )
}

export default Form;