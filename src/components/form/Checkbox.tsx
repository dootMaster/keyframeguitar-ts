type CheckboxProps = {
  i: number,
  note: string,
  handleChange: Function,
  cssAppend: string,
  checked: boolean,
}

const Checkbox = ({i, note, handleChange, cssAppend, checked=false}:CheckboxProps) => (
  <input
    type='checkbox'
    id={note + cssAppend}
    className={'checkbox-' + cssAppend + ' checkbox'}
    onChange={() => handleChange(i)}
    checked={checked}
  />
);

export default Checkbox;