import String from './String'

type FretboardProps = {
  fretboard: object[][],
  toggleFret: Function,
  accidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

const Fretboard = (props: FretboardProps) => (
  <>
  {props.fretboard.map((string, i) =>
    (
      <String
        string={string}
        i={i}
        toggleFret={props.toggleFret}
        accidental={props.accidental}
        flat={props.flat}
        sharp={props.sharp}
        both={props.both}
      />
    )
  )}
  </>
)

export default Fretboard;