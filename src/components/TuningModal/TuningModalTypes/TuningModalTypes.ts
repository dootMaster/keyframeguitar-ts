type TuningModalProps = {
  handleClose: Function,
  setTuning: Function,
  show: boolean,
  tuning: number[],
  fretboard: { display: string, dictIndex: number }[][],
  setFretboard: Function,
  fromForm: boolean[],
  toForm: boolean[],
}

type SelectNoteProps = {
  currentNote: number,
  labels: string[],
  position: number,
  handleTuningChange: Function,
}
export type { TuningModalProps, SelectNoteProps }