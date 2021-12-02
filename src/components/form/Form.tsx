import { both } from './helpers/notes'
import { useEffect, useState } from 'react';

interface FormType {
  accidental: string,
  type: Function,
  // flats: string[],
  // sharps: string[],
}

const Form = (props:FormType) => {

  const [notes, setNotes] = useState(new Array(both.length).fill(false));

  const handleChange = (position:number) => {
    const updatedNotesState = notes.map((item, index) => index === position ? !item : item);
    console.log(updatedNotesState);
    setNotes(updatedNotesState);
  }

  return (
    <form>
    {both.map((note, i) =>
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