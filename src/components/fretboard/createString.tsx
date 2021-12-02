export default function createString(startNote: number) {
  let guitarString = [];
  let i = startNote;

  while(guitarString.length < 13) {
    if(i < 12) guitarString.push({display: 'neutral', dictIndex: i});
    if(i >= 12) {
      i = 0;
      guitarString.push({display: 'neutral', dictIndex: i});
    }
    i += 1;
  }
  return guitarString;
}