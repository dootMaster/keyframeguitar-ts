import String from './GtrString'
import '../../CSS/Fretboard.css';
import { FretboardProps } from './FretboardTypes/FretboardTypes';

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
    <tfoot>
      <tr className='fret-dots'>
        {[0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0].map((fret, i) => {
          if(fret) return <td>{'•'}</td>
          if(i === 12) return <td>{'••'}</td>
          else return <td></td>
        })}
      </tr>
    </tfoot>
  </table>
)

export default Fretboard;