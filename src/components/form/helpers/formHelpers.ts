type GtrString = {
  display: string
  dictIndex: number
}

const updateFretboardViaForm = (fretboard:Array<GtrString[]>, otherForm:boolean[], updatedNotesState:boolean[], key:string) => {
  let fromForm:boolean[] = updatedNotesState, toForm:boolean[] = otherForm;
  if (key === 'to') {
    fromForm = otherForm;
    toForm = updatedNotesState;
  }

  fretboard.forEach((gtrString) => {
    gtrString.forEach((fret) => {
      let note = fret.dictIndex;
      if (fromForm[note] && toForm[note]) fret.display = 'common';
      else if (fromForm[note] && !toForm[note]) fret.display = 'from';
      else if (!fromForm[note] && toForm[note]) fret.display = 'to';
      else fret.display = 'neutral';
    })
  })
}

export { updateFretboardViaForm};
