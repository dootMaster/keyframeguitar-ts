import { returnsCommonTuningForStringQty } from './helpers/defaultTunings';
import { updateFretboardViaForm } from './helpers/formHelpers';
import createFretboard from '../fretboard/helpers/createFretboard';
import '../../CSS/StringQtySelect.css';
import { StringQtyTypes } from './FormTypes/FormTypes';


const StringQtySelect = ({ setTuning, setFretboard, fretboard, fromForm, toForm, tuning }:StringQtyTypes) => {

  let standardTuning = [4, 11, 7, 2, 9, 4]

  const changeStringAmount = (event:React.ChangeEvent<HTMLSelectElement>) => {
    let newCount = parseInt(event.currentTarget.value);
    let defaultTuning = returnsCommonTuningForStringQty(event.currentTarget.value) || standardTuning;
    let newTuning: number[];

    if (newCount <= tuning.length) {
      // Removing strings: keep the top ones (highest pitch)
      newTuning = tuning.slice(0, newCount);
    } else {
      // Adding strings: keep current tuning, append new strings from standard
      newTuning = [...tuning, ...defaultTuning.slice(tuning.length)];
    }

    setTuning(newTuning);

    let newFretboard = newTuning.map((note, i) => {
      // If this string existed before with the same tuning, keep its state
      if (i < tuning.length && tuning[i] === note) {
        return fretboard[i];
      }
      // Otherwise create a fresh string and apply form state
      let freshString = createFretboard([note])[0];
      updateFretboardViaForm([freshString], toForm, fromForm, 'from');
      return freshString;
    });

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