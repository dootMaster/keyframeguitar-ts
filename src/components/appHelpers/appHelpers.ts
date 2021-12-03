type GtrString = {
  display: string
  dictIndex: number
}

const updateFretboardViaForm = (fretboard:Array<GtrString[]>, currentForm:boolean[], targetForm:boolean[]) => {
  fretboard.forEach((gtrString, i) => {
    gtrString.forEach((fret, j) => {
      let note = fret.dictIndex;
      if(currentForm[note] && targetForm[note]) fret.display = 'common';
      else if(currentForm[note] && !targetForm[note]) fret.display = 'current';
      else if(!currentForm[note] && targetForm[note]) fret.display = 'target';
      else fret.display = 'neutral';
    })
  })
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

export { updateFretboardViaForm, updateFretboardViaToggle };