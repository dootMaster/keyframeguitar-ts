const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const both = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

const flatToSharp: Record<string, string> = {};
flats.forEach((f, i) => { flatToSharp[f] = sharps[i]; });

function renotate(name: string, noteNames: string[]): string {
  const useFlats = noteNames === flats;
  if (useFlats) return name;
  const spaceIdx = name.indexOf(' ');
  if (spaceIdx === -1) return name;
  const root = name.slice(0, spaceIdx);
  const rest = name.slice(spaceIdx);
  return (flatToSharp[root] || root) + rest;
}

export { flats, sharps, both, renotate }