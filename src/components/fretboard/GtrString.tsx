import Fret from './Fret'

type FretProps = {
  display: string
  dictIndex: number
}

type StringProps = {
  gtrString: FretProps[]
  toggleFret: Function
  accidental: string
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
  i: number
}

const GtrString = (props: StringProps) => (
  <tr className='string'>
  {props.gtrString.map((fret, j) =>
    (
      <Fret
        {...props}
        {...fret}
        j={j}
        key={j}
      />
    )
  )}
  </tr>
)
export default GtrString;
