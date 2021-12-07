import '../../CSS/TuningModal.css';
import TuningModalProps from './TuningModalTypes/TuningModalTypes';

const TuningModal = ({ handleClose, show, tuning }:TuningModalProps) => {
  const showHideClassName = show ? "tuning-modal display-block" : "tuning-modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="tuning-modal-main">
        {'Alternate tunings feature is under construction.'}
        <button onClick={() => handleClose()}>
          {'X'}
        </button>
      </section>
    </div>
  );
};

export default TuningModal;