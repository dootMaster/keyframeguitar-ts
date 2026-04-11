type FretProps = {
  i: number,
  j: number,
  display: string,
  dictIndex: number,
  toggleFret: Function,
  flat: {[key: number]: string},
  showAllNotes: boolean,
  peek: boolean,
}

type FretType = {
  display: string
  dictIndex: number
}

type StringProps = {
  gtrString: FretType[]
  toggleFret: Function
  flat: {[key: number]: string},
  showAllNotes: boolean,
  peekForm: boolean[] | null,
  i: number
}

type FretboardProps = {
  fretboard: FretType[][],
  toggleFret: Function,
  flat: {[key: number]: string},
  showAllNotes: boolean,
  peekForm: boolean[] | null,
  scrollResetKey: number,
}

export type {
  FretProps,
  FretType,
  StringProps,
  FretboardProps,
}