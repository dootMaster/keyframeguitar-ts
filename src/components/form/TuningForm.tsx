import { returnsCommonTuningForStringQty } from './helpers/defaultTunings';
import { updateFretboardViaForm } from '../appHelpers/appHelpers';
import createFretboard from '../fretboard/helpers/createFretboard';

type GtrString = {
  display: string
  dictIndex: number
}

type CurrentForm = {
  currentForm: boolean,
}

type TargetForm = {
  targetForm: boolean,
}

type PropTypes = {
  accidental: string,
  setFretboard: Function,
  fretboard: Array<GtrString>[],
  currentForm: CurrentForm[],
  targetForm: TargetForm[],
}

const TuningForm = (props:PropTypes) => {

  const changeStringAmount = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let newTuning = returnsCommonTuningForStringQty(event.currentTarget.value) || [4, 11, 7, 2, 9, 4];
    let newFretboard = createFretboard(newTuning);
    updateFretboardViaForm(newFretboard, props.currentForm, props.targetForm)
    props.setFretboard(newFretboard);
  }

  return (
  <>
    <label htmlFor="String Amount">Strings:</label>
      <select id="String Amount" name="String Amount" onChange={(e) => changeStringAmount(e)}>
        <option value={4}>{4}</option>
        <option value={5}>{5}</option>
        <option selected value={6}>{6}</option>
        <option value={7}>{7}</option>
        <option value={8}>{8}</option>
        <option value={9}>{9}</option>
      </select>
  </>
  )
}

export default TuningForm