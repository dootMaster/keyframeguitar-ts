import { FretProps } from "./FretboardTypes/FretboardTypes"

export default function Fret({ flat, display, toggleFret, i, j, dictIndex, noteDisplayMode, peek, preview, degreeLabel, isGuideTone, showGuideTones }: FretProps) {
  const noteName = flat[dictIndex];
  const isNeutral = display === 'neutral';
  const isOctave = j > 0 && j % 12 === 0;
  const mod = j % 12;
  const isDotCol = mod === 3 || mod === 5 || mod === 7 || mod === 9 || (j > 0 && mod === 0);
  const peekClass = peek && isNeutral && !preview ? ' peek' : '';
  const peekShared = peek && !isNeutral && !preview ? ' peek-shared' : '';
  const previewClass = preview ? ' preview' : '';
  const guideClass = showGuideTones && !isNeutral && !preview && !isGuideTone ? ' guide-dimmed' : '';

  const showDegrees = noteDisplayMode === 'degrees' || noteDisplayMode === 'both';
  const showGhosts = noteDisplayMode === 'notes' || noteDisplayMode === 'both';
  const activeLabel = showDegrees && degreeLabel ? degreeLabel : noteName;

  let label;
  if (preview) {
    label = <span className="preview-note">{noteName}</span>;
  } else if (!isNeutral) {
    label = activeLabel;
  } else if (peek) {
    label = <span className="peek-note">{noteName}</span>;
  } else if (showGhosts) {
    label = <span className="ghost-note">{noteName}</span>;
  } else {
    label = '\u00A0';
  }

  return (
    <td
      className={display + ' fret' + (isOctave ? ' octave-marker' : '') + (isDotCol ? ' dot-col' : '') + peekClass + peekShared + previewClass + guideClass}
      onClick={() => toggleFret(i, j, false)}
      onContextMenu={(e) => { e.preventDefault(); toggleFret(i, j, true); }}
      title={noteName}
      data-string={i}
      data-fret={j}
    >
      <span className="fret-label">{label}</span>
    </td>
  );
}