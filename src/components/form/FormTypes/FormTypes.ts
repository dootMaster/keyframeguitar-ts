type FretType = {
  display: string
  dictIndex: number
}

type FormType = {
  accidental: string,
  form: boolean[],
  setForm: Function,
  cssAppend: string,
}

type StringQtyTypes = {
  accidental: string,
  setFretboard: Function,
  fretboard: Array<FretType>[],
  currentForm: boolean[],
  targetForm: boolean[],
  setTuning: Function,
}

type CheckboxProps = {
  i: number,
  note: string,
  handleChange: Function,
  cssAppend: string,
  checked: boolean,
}

export type {
  FormType,
  StringQtyTypes,
  CheckboxProps,
}