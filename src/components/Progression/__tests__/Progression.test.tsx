import React from 'react';
import { render, screen } from '@testing-library/react';
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

function renderProgression(overrides: Partial<typeof defaultProps> = {}) {
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
