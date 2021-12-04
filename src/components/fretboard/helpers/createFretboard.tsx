export default function createFretboard(tuning: number[]) {
  return tuning.map(root => createString(root));
}

function createString(startNote: number) {
  let guitarString = [];
  let i = startNote;

  while(guitarString.length <= 12) {
    if(i === 12) {
      i = 0;
    }

    guitarString.push({display: 'neutral', dictIndex: i});

    i += 1;
  }
  return guitarString;
}


