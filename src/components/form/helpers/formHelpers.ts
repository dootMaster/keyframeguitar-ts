type GtrString = {
  display: string
  dictIndex: number
}

const updateFretboardViaForm = (fretboard:Array<GtrString[]>, otherForm:boolean[], updatedNotesState:boolean[], key:string) => {
  let currentForm:boolean[] = updatedNotesState, targetForm:boolean[] = otherForm;
  if (key === 'target') {
    currentForm = otherForm;
    targetForm = updatedNotesState;
  }

  fretboard.forEach((gtrString) => {
    gtrString.forEach((fret) => {
      let note = fret.dictIndex;
      if (currentForm[note] && targetForm[note]) fret.display = 'common';
      else if (currentForm[note] && !targetForm[note]) fret.display = 'current';
      else if (!currentForm[note] && targetForm[note]) fret.display = 'target';
      else fret.display = 'neutral';
    })
  })
}

export { updateFretboardViaForm};