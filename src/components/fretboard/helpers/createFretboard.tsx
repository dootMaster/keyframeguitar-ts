import createString from './createString'

export default function createFretboard(tuning: number[]) {
  return tuning.map(root => createString(root));
}



