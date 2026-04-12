import * as Dialog from '@radix-ui/react-dialog';
import '../../CSS/OptionsModal.css';

export type ColorConfig = {
  from: string;
  to: string;
  peek: string;
  preview: string;
};

export const DEFAULT_COLORS: ColorConfig = {
  from: '#6366F1',
  to: '#10B981',
  peek: '#F59E0B',
  preview: '#94A3B8',
};

export const COLORBLIND_COLORS: ColorConfig = {
  from: '#3B82F6',
  to: '#F97316',
  peek: '#A855F7',
  preview: '#14B8A6',
};

type OptionsModalProps = {
  show: boolean;
  handleClose: () => void;
  colors: ColorConfig;
  setColors: (colors: ColorConfig) => void;
  colorblind: boolean;
  setColorblind: (on: boolean) => void;
};

export default function OptionsModal({
  show, handleClose, colors, setColors, colorblind, setColorblind
}: OptionsModalProps) {
  const handleColorblindToggle = () => {
    if (!colorblind) {
      setColorblind(true);
      setColors(COLORBLIND_COLORS);
    } else {
      setColorblind(false);
      setColors(DEFAULT_COLORS);
    }
  };

  const handleReset = () => {
    setColorblind(false);
    setColors(DEFAULT_COLORS);
  };

  const updateColor = (key: keyof ColorConfig, value: string) => {
    setColorblind(false);
    setColors({ ...colors, [key]: value });
  };

  return (
    <Dialog.Root open={show} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="options-modal">
          <h4 className="options-title">Options</h4>

          <div className="options-section">
            <label className="options-toggle-label">
              <input
                type="checkbox"
                checked={colorblind}
                onChange={handleColorblindToggle}
              />
              <span>Colorblind-friendly palette</span>
            </label>
          </div>

          <div className="options-section">
            <span className="options-section-title">Colors</span>
            <div className="options-colors">
              <label className="options-color-row">
                <input
                  type="color"
                  value={colors.from}
                  onChange={(e) => updateColor('from', e.target.value)}
                />
                <span>From</span>
              </label>
              <label className="options-color-row">
                <input
                  type="color"
                  value={colors.to}
                  onChange={(e) => updateColor('to', e.target.value)}
                />
                <span>To</span>
              </label>
              <label className="options-color-row">
                <input
                  type="color"
                  value={colors.peek}
                  onChange={(e) => updateColor('peek', e.target.value)}
                />
                <span>Peek</span>
              </label>
              <label className="options-color-row">
                <input
                  type="color"
                  value={colors.preview}
                  onChange={(e) => updateColor('preview', e.target.value)}
                />
                <span>Preview</span>
              </label>
            </div>
          </div>

          <button className="options-reset-btn" onClick={handleReset}>Reset to defaults</button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
