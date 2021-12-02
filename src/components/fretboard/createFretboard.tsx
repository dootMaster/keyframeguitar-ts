import createString from './createString'

export function createFretboard(tuning: number[]) {
  return tuning.map(root => createString(root));
}



