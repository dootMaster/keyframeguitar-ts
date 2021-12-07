type FretProps = {
  i: number,
  j: number,
  display: string,
  dictIndex: number,
  toggleFret: Function,
  globalAccidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

type FretType = {
  display: string
  dictIndex: number
}

type StringProps = {
  gtrString: FretType[]
  toggleFret: Function
  globalAccidental: string
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
  i: number
}

type FretboardProps = {
  fretboard: FretType[][],
  toggleFret: Function,
  globalAccidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

export type {
  FretProps,
  FretType,
  StringProps,
  FretboardProps,
}