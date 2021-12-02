import String from './String'

type FretboardProps = {
  fretboard: object[][],
  toggleFret: Function,
  accidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

export default function Fretboard(props: FretboardProps) {
  return props.fretboard.map((string, i) =>
    (
      <String
        string={string}
        i={i}
        toggleFret={props.toggleFret}

      />
    )
  )
}