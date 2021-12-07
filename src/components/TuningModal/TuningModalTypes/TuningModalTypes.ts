type TuningModalProps = {
  handleClose: Function,
  setTuning: Function,
  show: boolean,
  tuning: number[],
  globalAccidental: string,
  setFretboard: Function,
  currentForm: boolean[],
  targetForm: boolean[],
}

type SelectNoteProps = {
  currentNote: number,
  labels: string[],
  position: number,
  handleTuningChange: Function,
}
export type { TuningModalProps, SelectNoteProps }