type FretProps = {
  display: string,
  dictIndex: number,
  toggleFret: Function,
  accidental: string,
  i: number,
  j: number,
  flat: {[key: number]: string},
  sharp: {[key: number]: string},
  both: {[key: number]: string},
}

export default function Fret(props: FretProps) {
  return <td className={props.display + ` fret`} onClick={() => props.toggleFret(props.i, props.j)}>
  {props.accidental === 'b' ? props.flat[props.dictIndex] : props.accidental === '#' ? props.sharp[props.dictIndex] : props.both[props.dictIndex]}
  </td>
}