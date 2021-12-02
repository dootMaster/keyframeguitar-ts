import { flats, sharps, both } from './helpers/notes'
import { useEffect, useState } from 'react';

type FormType = {
  accidental: string,
  form: boolean[],
  setForm: Function,
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
    <form>
    {accidental.map((note, i) =>
        (
          <>
          <input
            type='checkbox'
            id={note}
            onChange={() => handleChange(i)}
          />
          <label htmlFor={note}>{note}</label><br/>
          </>
        )
      )
    }
    </form>
  )
}

export default Form;