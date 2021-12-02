import String from './GtrString'

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
  <table className='fretboard'>
    <tbody>
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
            key={i}
          />
        )
      )}
    </tbody>
  </table>
)

export default Fretboard;