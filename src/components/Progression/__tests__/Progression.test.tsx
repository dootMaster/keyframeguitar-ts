import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Progression from '../Progression';

const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const noop = () => {};

const defaultProps = {
  progression: [] as { name: string; form: boolean[] }[],
  windowIndex: 0,
  onRemove: noop,
  onNavigate: noop,
  onClear: noop,
  showPeek: false,
  soloIndex: null,
  onSolo: noop,
  noteNames,
};

type Overrides = Partial<typeof defaultProps & { onSelectChords: () => void; onUndo: () => void; canUndo: boolean }>;

function renderProgression(overrides: Overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<Progression {...props} />);
}

describe('Progression', () => {
  it('renders placeholder text when progression is empty', () => {
    renderProgression();
    expect(
      screen.getByText(/Add two or more chords/),
    ).toBeInTheDocument();
  });

  it('renders the hint when there is only one chord', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
    });
    expect(screen.getByText(/Add one more chord/)).toBeInTheDocument();
  });

  it('renders both pill labels with correct names when two chords are present', () => {
    renderProgression({
      progression: [
        { name: 'C maj', form: [] },
        { name: 'G maj', form: [] },
      ],
    });
    // noteNames uses flats, but renotate returns the name as-is for flats
    expect(screen.getByText('C maj')).toBeInTheDocument();
    expect(screen.getByText('G maj')).toBeInTheDocument();
  });

  it('navigation buttons are disabled when fewer than 2 chords', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
    });
    const prevBtn = screen.getByRole('button', { name: 'Previous pair' });
    const nextBtn = screen.getByRole('button', { name: 'Next pair' });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });

  it('navigation buttons are enabled when 2 or more chords', () => {
    renderProgression({
      progression: [
        { name: 'C maj', form: [] },
        { name: 'G maj', form: [] },
      ],
    });
    const prevBtn = screen.getByRole('button', { name: 'Previous pair' });
    const nextBtn = screen.getByRole('button', { name: 'Next pair' });
    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
  });

  it('clear button is rendered when progression is non-empty', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
    });
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });
});

describe('Progression — mobile buttons', () => {
  it('renders "+" button when onSelectChords is provided (empty state)', () => {
    renderProgression({ onSelectChords: noop });
    expect(screen.getByRole('button', { name: 'Select chords' })).toBeInTheDocument();
  });

  it('does not render "+" button when onSelectChords is omitted', () => {
    renderProgression();
    expect(screen.queryByRole('button', { name: 'Select chords' })).toBeNull();
  });

  it('renders "+" button in non-empty progression too', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
      onSelectChords: noop,
    });
    expect(screen.getByRole('button', { name: 'Select chords' })).toBeInTheDocument();
  });

  it('fires onSelectChords callback when "+" is clicked', async () => {
    const user = userEvent.setup();
    const onSelectChords = vi.fn();
    renderProgression({ onSelectChords });
    await user.click(screen.getByRole('button', { name: 'Select chords' }));
    expect(onSelectChords).toHaveBeenCalledOnce();
  });

  it('renders undo button when onUndo is provided', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
      onUndo: noop,
      canUndo: true,
    });
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('does not render undo button when onUndo is omitted', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
    });
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
  });

  it('undo button is disabled when canUndo is false', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
      onUndo: noop,
      canUndo: false,
    });
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('undo button is enabled when canUndo is true', () => {
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
      onUndo: noop,
      canUndo: true,
    });
    expect(screen.getByRole('button', { name: 'Undo' })).not.toBeDisabled();
  });

  it('fires onUndo callback when undo is clicked', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    renderProgression({
      progression: [{ name: 'C maj', form: [] }],
      onUndo,
      canUndo: true,
    });
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });
});
