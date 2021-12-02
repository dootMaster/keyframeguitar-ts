import Fret from './Fret'

type StringProps = {
  string: object[],
  toggleFret: Function,
  i: number,
  accidental: string,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

type fretType = {

}

const String = (props: StringProps) => (
  <>
  {props.string.map((fret, j) =>
    (
      <Fret
        display={fret.display}
        dictIndex={fret.dictIndex}
        toggleFret={props.toggleFret}
        accidental={props.accidental}
        i={props.i}
        j={j}
        flat={props.flat}
        sharp={props.sharp}
        both={props.both}
      />
    )
  )}
  </>
)

export default String;
