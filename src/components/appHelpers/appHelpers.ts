type GtrString = {
  display: string
  dictIndex: number
}



const updateFretboardViaToggle = (fretboard:Array<GtrString[]>, string:number, fret:number) => {
  switch(fretboard[string][fret].display) {
    case 'neutral':
      fretboard[string][fret].display = 'current';
      break;
    case 'current':
      fretboard[string][fret].display = 'target';
      break;
    case 'target':
      fretboard[string][fret].display = 'common';
      break;
    case 'common':
      fretboard[string][fret].display = 'neutral';
      break;
  }
}

export { updateFretboardViaToggle };