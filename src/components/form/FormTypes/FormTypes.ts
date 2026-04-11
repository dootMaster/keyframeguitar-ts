type FretType = {
  display: string
  dictIndex: number
}

type FormType = {
  form: boolean[],
  setForm: Function,
  cssAppend: string,
  fretboard: Array<FretType>[],
  fromForm: boolean[],
  toForm: boolean[],
  setFretboard: Function,
}

type StringQtyTypes = {
  tuning: number[],
  setFretboard: Function,
  fretboard: Array<FretType>[],
  fromForm: boolean[],
  toForm: boolean[],
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