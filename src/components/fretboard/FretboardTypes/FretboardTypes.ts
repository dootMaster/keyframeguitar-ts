type NoteDisplayMode = 'off' | 'notes' | 'degrees' | 'both';

type FretProps = {
  i: number,
  j: number,
  display: string,
  dictIndex: number,
  toggleFret: Function,
  flat: {[key: number]: string},
  noteDisplayMode: NoteDisplayMode,
  peek: boolean,
  preview: boolean,
  degreeLabel: string | null,
  isGuideTone: boolean,
  showGuideTones: boolean,
}

type FretType = {
  display: string
  dictIndex: number
}

type StringProps = {
  gtrString: FretType[]
  toggleFret: Function
  flat: {[key: number]: string},
  noteDisplayMode: NoteDisplayMode,
  peekForm: boolean[] | null,
  previewForm: boolean[] | null,
  fromDegrees: (string | null)[],
  toDegrees: (string | null)[],
  fromGuide: boolean[],
  toGuide: boolean[],
  showGuideTones: boolean,
  soloActive: boolean,
  i: number
}

type FretboardProps = {
  fretboard: FretType[][],
  toggleFret: Function,
  flat: {[key: number]: string},
  noteDisplayMode: NoteDisplayMode,
  peekForm: boolean[] | null,
  previewForm: boolean[] | null,
  scrollResetKey: number,
  fromDegrees: (string | null)[],
  toDegrees: (string | null)[],
  fromGuide: boolean[],
  toGuide: boolean[],
  showGuideTones: boolean,
  soloActive: boolean,
}

export type {
  NoteDisplayMode,
  FretProps,
  FretType,
  StringProps,
  FretboardProps,
}