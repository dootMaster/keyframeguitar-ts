import Fret from './Fret'

interface FretProps {
  display: string
  dictIndex: number
}

interface StringProps {
  gtrString: FretProps[]
  toggleFret: Function
  accidental: string
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
  i: number
}

const String = (props: StringProps) => (
  <div>
  {props.gtrString.map((fret, j) =>
    (
      <Fret
        {...props}
        {...fret}
        j={j}
      />
    )
  )}
  </div>
)
export default String;
