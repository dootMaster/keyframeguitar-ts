import '../../CSS/TuningModal.css';
import TuningModalProps from './TuningModalTypes/TuningModalTypes';

const TuningModal = ({ handleClose, show, tuning }:TuningModalProps) => {
  const showHideClassName = show ? "tuning-modal display-block" : "tuning-modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="tuning-modal-main">
        {tuning}
        <button onClick={() => handleClose()}>
          {'X'}
        </button>
      </section>
    </div>
  );
};

export default TuningModal;