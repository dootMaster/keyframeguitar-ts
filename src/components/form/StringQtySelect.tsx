import { returnsCommonTuningForStringQty } from './helpers/defaultTunings';
import { updateFretboardViaForm } from './helpers/formHelpers';
import createFretboard from '../fretboard/helpers/createFretboard';
import '../../CSS/StringQtySelect.css';
import { StringQtyTypes } from './FormTypes/FormTypes';


const StringQtySelect = ({ setTuning, setFretboard, currentForm, targetForm }:StringQtyTypes) => {

  let standardTuning = [4, 11, 7, 2, 9, 4]

  const changeStringAmount = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let newTuning = returnsCommonTuningForStringQty(event.currentTarget.value) || standardTuning;
    setTuning(newTuning);
    let newFretboard = createFretboard(newTuning);
    updateFretboardViaForm(newFretboard, currentForm, targetForm, 'target')
    setFretboard(newFretboard);
  }

  return (
  <div className='string-qty-container'>
    <label htmlFor="String Amount" className='string-qty-label'>{'#'}</label>
    <select name="String Amount" className='string-qty-select' onChange={(e) => changeStringAmount(e)} defaultValue={6}>
      <option value={4}>{4}</option>
      <option value={5}>{5}</option>
      <option value={6}>{6}</option>
      <option value={7}>{7}</option>
      <option value={8}>{8}</option>
      <option value={9}>{9}</option>
    </select>
  </div>
  )
}

export default StringQtySelect;