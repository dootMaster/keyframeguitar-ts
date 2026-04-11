import React from 'react';
import { render, screen } from '@testing-library/react';
import Fret from '../Fret';
import { flat } from '../helpers/stringDict';

const defaultProps = {
  i: 0,
  j: 3,
  display: 'neutral',
  dictIndex: 3,
  toggleFret: () => {},
  flat,
  noteDisplayMode: 'off' as const,
  peek: false,
  preview: false,
  degreeLabel: null,
  isGuideTone: false,
  showGuideTones: false,
};

function renderFret(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(
    <table>
      <tbody>
        <tr>
          <Fret {...props} />
        </tr>
      </tbody>
    </table>,
  );
}

describe('Fret', () => {
  it('renders non-breaking space when neutral and noteDisplayMode is off', () => {
    renderFret();
    const label = document.querySelector('.fret-label');
    expect(label).not.toBeNull();
    expect(label!.textContent).toBe('\u00A0');
  });

  it('renders ghost-note with the note name when neutral and noteDisplayMode is notes', () => {
    renderFret({ noteDisplayMode: 'notes' });
    const ghost = document.querySelector('.ghost-note');
    expect(ghost).not.toBeNull();
    expect(ghost!.textContent).toBe('Eb');
  });

  it('shows note name on a from fret when noteDisplayMode is off', () => {
    renderFret({ display: 'from', noteDisplayMode: 'off' });
    const label = screen.getByText('Eb');
    expect(label).toBeInTheDocument();
  });

  it('shows degree label on a from fret when noteDisplayMode is degrees and degreeLabel is set', () => {
    renderFret({ display: 'from', noteDisplayMode: 'degrees', degreeLabel: 'R' });
    const label = screen.getByText('R');
    expect(label).toBeInTheDocument();
  });

  it('shows degree label on a from fret when noteDisplayMode is both and degreeLabel is set', () => {
    renderFret({ display: 'from', noteDisplayMode: 'both', degreeLabel: '3' });
    const label = screen.getByText('3');
    expect(label).toBeInTheDocument();
  });

  it('applies guide-dimmed class when showGuideTones is true and isGuideTone is false on a non-neutral fret', () => {
    renderFret({ display: 'from', showGuideTones: true, isGuideTone: false });
    const td = document.querySelector('td');
    expect(td!.className).toContain('guide-dimmed');
  });

  it('does not apply guide-dimmed class when isGuideTone is true', () => {
    renderFret({ display: 'from', showGuideTones: true, isGuideTone: true });
    const td = document.querySelector('td');
    expect(td!.className).not.toContain('guide-dimmed');
  });

  it('preview fret always shows note name regardless of noteDisplayMode', () => {
    renderFret({ display: 'neutral', preview: true, noteDisplayMode: 'off' });
    const previewNote = document.querySelector('.preview-note');
    expect(previewNote).not.toBeNull();
    expect(previewNote!.textContent).toBe('Eb');
  });
});
