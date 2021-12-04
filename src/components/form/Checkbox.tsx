import { CheckboxProps } from "./FormTypes/FormTypes";

const Checkbox = ({i, note, handleChange, cssAppend, checked=false}:CheckboxProps) => (
  <input
    type='checkbox'
    id={note + cssAppend}
    className={'checkbox-' + cssAppend + ' checkbox'}
    onChange={() => {handleChange(i);}}
    checked={checked}
  />
);

export default Checkbox;