import { FretProps } from "./FretboardTypes/FretboardTypes"

export default function Fret({ globalAccidental, flat, sharp, both, display, toggleFret, i , j, dictIndex }: FretProps) {
  return <td className={display + ` fret`} onClick={() => toggleFret(i, j)}>
  {globalAccidental === 'b' ? flat[dictIndex] : globalAccidental === '#' ? sharp[dictIndex] : both[dictIndex]}
  </td>
}