import { FretProps } from "./FretboardTypes/FretboardTypes"

export default function Fret({ flat, display, toggleFret, i , j, dictIndex, showAllNotes, peek, preview }: FretProps) {
  const noteName = flat[dictIndex];
  const isNeutral = display === 'neutral';
  const isOctave = j > 0 && j % 12 === 0;
  const peekClass = peek && isNeutral && !preview ? ' peek' : '';
  const peekShared = peek && !isNeutral && !preview ? ' peek-shared' : '';
  const previewClass = preview ? ' preview' : '';
  return <td className={display + ' fret' + (isOctave ? ' octave-marker' : '') + peekClass + peekShared + previewClass} onClick={() => toggleFret(i, j, false)} onContextMenu={(e) => { e.preventDefault(); toggleFret(i, j, true); }} title={noteName} data-string={i} data-fret={j}>
  <span className="fret-label">{preview ? <span className="preview-note">{noteName}</span> : !isNeutral ? noteName : peek ? <span className="peek-note">{noteName}</span> : showAllNotes ? <span className="ghost-note">{noteName}</span> : '\u00A0'}</span>
  </td>
}