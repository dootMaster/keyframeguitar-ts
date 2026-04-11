import Fret from './Fret'
import { StringProps } from './FretboardTypes/FretboardTypes';

const GtrString = (props: StringProps) => (
  <tr className='string'>
  {props.gtrString.map((fret, j) => {
    const d = fret.dictIndex;
    const display = fret.display;
    const degreeLabel = display === 'from' || display === 'common'
      ? props.fromDegrees[d]
      : display === 'to'
        ? props.toDegrees[d]
        : null;
    const isGuideTone = display === 'from'
      ? props.fromGuide[d]
      : display === 'to'
        ? props.toGuide[d]
        : display === 'common'
          ? props.soloActive ? props.fromGuide[d] : (props.fromGuide[d] || props.toGuide[d])
          : false;
    return (
      <Fret
        {...props}
        {...fret}
        j={j}
        key={j}
        peek={props.peekForm ? props.peekForm[d] : false}
        preview={props.previewForm ? props.previewForm[d] : false}
        degreeLabel={degreeLabel}
        isGuideTone={isGuideTone}
      />
    );
  })}
  </tr>
)
export default GtrString;
