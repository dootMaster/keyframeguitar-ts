import String from './String'

interface GtrStringProps {
  display: string
  dictIndex: number
}

interface FretboardProps {
  fretboard: GtrStringProps[][],
  toggleFret: Function,
  accidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

const Fretboard = (props: FretboardProps) => (
  <>
  {props.fretboard.map((gtrString, i) =>
    (
      <String
        gtrString={gtrString}
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