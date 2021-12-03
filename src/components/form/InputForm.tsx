import { flats, sharps, both } from './helpers/notes'
import { useEffect, useState } from 'react';
import '../../CSS/InputForm.css';

type FormType = {
  accidental: string,
  form: boolean[],
  setForm: Function,
  cssAppend: string,
}

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
            <input
              type='checkbox'
              id={note + props.cssAppend}
              className={'checkbox-' + props.cssAppend + ' checkbox'}
              onChange={() => handleChange(i)}
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