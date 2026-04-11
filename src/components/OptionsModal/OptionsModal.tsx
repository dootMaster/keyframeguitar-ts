import { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
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
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, handleClose]);

  if (!show) return null;

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
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <div className="save-overlay" onClick={handleClose}>
        <div className="options-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </div>
    </FocusTrap>
  );
}
