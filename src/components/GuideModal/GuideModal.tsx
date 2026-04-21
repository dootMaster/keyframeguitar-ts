import * as Dialog from '@radix-ui/react-dialog';
import '../../CSS/GuideModal.css';

type GuideModalProps = {
  show: boolean;
  handleClose: () => void;
};

export default function GuideModal({ show, handleClose }: GuideModalProps) {
  return (
    <Dialog.Root open={show} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="guide-modal">
          <h4 className="guide-title">Usage Guide</h4>

        <div className="guide-section">
          <span className="guide-heading">The Idea</span>
          <p>The fretboard shows two chords at a time. The first color is the chord you're <strong>coming from</strong>, the second is the chord you're <strong>going to</strong>. Notes that appear in both chords are split between the two colors. The tones listed below the fretboard show what's in each chord, with small dots marking the shared tones.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Building a Progression</span>
          <p>Select a root note and chord quality from the sidebar to preview it on the fretboard. Click <strong>Add</strong> to add it to your progression. Your first chord will display immediately; add a second to see keyframes. Use the <strong>b/#</strong> toggle above the root notes to switch between flat and sharp note names.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Navigating</span>
          <p>Use the <strong>&lsaquo;</strong> / <strong>&rsaquo;</strong> arrows, left/right arrow keys, or click any pill in the progression bar to jump to a pair. The last chord wraps back to the first, so you can practice the full loop.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Solo</span>
          <p>Toggle <strong>Solo</strong> in the toolbar to isolate the current <strong>from</strong> chord on the fretboard, hiding the <strong>to</strong> chord. You can also click the first colored pill in the current pair. Toggle again to return to the pair view.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Peek</span>
          <p>Toggle <strong>Peek</strong> in the toolbar to faintly show the next chord after the current pair so you can plan ahead. Requires 3+ chords.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Preview</span>
          <p>Selecting a chord quality previews it on the fretboard before adding. Click the same quality again to dismiss the preview.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Presets &amp; Transposition</span>
          <p>Open <strong>Presets</strong> in the sidebar to load foundational progressions or songs. Use the <strong>Key</strong> dropdown to transpose any preset to a different key.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Sharing</span>
          <p>Click <strong>Share</strong> in the toolbar to copy a link to your current progression. Anyone who opens it will see the same chords loaded up.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Saving</span>
          <p>Click <strong>Save</strong> to store your progression, fretboard state, and notes locally. Load them from the <strong>My Saves</strong> tab in Presets.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Keyboard Shortcuts</span>
          <p><strong>Left/Right arrows</strong> navigate the progression. <strong>Ctrl+Z</strong> (or <strong>Cmd+Z</strong>) undoes changes to the progression like adding, removing, clearing, or loading a preset.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Notes &amp; Degrees</span>
          <p>Click <strong>Notes</strong> in the toolbar to cycle through display modes: note names on all frets, degree labels on chord tones (R, b3, 3, 5, b7, 7, etc.), both at once, or off. Degrees show each note's relationship to its chord root.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">3/7 Guide Tones</span>
          <p>Toggle <strong>3/7</strong> to dim everything except the 3rds and 7ths of each chord. These are the guide tones that define chord quality and show you the smoothest voice leading between changes. Works great with degree labels on.</p>
        </div>

        <div className="guide-section">
          <span className="guide-heading">Other Tools</span>
          <p><strong>Tuning</strong> changes to alternate tunings. <strong>Options</strong> customizes colors. <strong>Center</strong> resets the fretboard scroll position back to the nut. <strong>Print</strong> generates a printable view.</p>
        </div>

          <button className="guide-close-btn" onClick={handleClose}>Got it</button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
