import Fret from './Fret'
import { StringProps } from './FretboardTypes/FretboardTypes';

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
