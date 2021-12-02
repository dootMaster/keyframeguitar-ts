import { isPropertySignature } from 'typescript'
import Fret from './Fret'

type StringProps = {
  string: object[],
  toggleFret: Function,

}

export default function String(props: StringProps) {
  return props.string.map((fret, j) =>
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
  )
}