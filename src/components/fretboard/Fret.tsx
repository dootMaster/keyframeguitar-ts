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
  return <span className={props.display + ` fret`} onClick={() => props.toggleFret(i, j)}>
  {props.accidental === 'flat' ? props.flat[props.dictIndex] : props.accidental === 'sharp' ? props.sharp[props.dictIndex] : props.both[props.dictIndex]}
  </span>
}