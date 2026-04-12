import React from 'react';
import { render } from '@testing-library/react';
import Fret from '../Fret';
import { flat } from '../helpers/stringDict';
import { FretProps } from '../FretboardTypes/FretboardTypes';

const defaultProps: FretProps = {
  i: 0,
  j: 0,
  display: 'neutral',
  dictIndex: 0,
  toggleFret: () => {},
  flat,
  noteDisplayMode: 'off',
  peek: false,
  preview: false,
  degreeLabel: null,
  isGuideTone: false,
  showGuideTones: false,
};

function renderFret(overrides: Partial<FretProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  render(
    <table>
      <tbody>
        <tr>
          <Fret {...props} />
        </tr>
      </tbody>
    </table>,
  );
  return document.querySelector('td')!;
}

describe('Fret dot-col class', () => {
  const dotFrets = [3, 5, 7, 9, 12, 24];
  const nonDotFrets = [0, 1, 2, 4, 6, 8, 10, 11];

  dotFrets.forEach((j) => {
    it(`fret ${j} gets dot-col class`, () => {
      const td = renderFret({ j, dictIndex: j % 12 });
      expect(td.className).toContain('dot-col');
    });
  });

  nonDotFrets.forEach((j) => {
    it(`fret ${j} does not get dot-col class`, () => {
      const td = renderFret({ j, dictIndex: j % 12 });
      expect(td.className).not.toContain('dot-col');
    });
  });

  it('fret 0 (open string) does not get dot-col even though 0 % 12 === 0', () => {
    const td = renderFret({ j: 0, dictIndex: 0 });
    expect(td.className).not.toContain('dot-col');
  });

  it('fret 12 gets both dot-col and octave-marker', () => {
    const td = renderFret({ j: 12, dictIndex: 0 });
    expect(td.className).toContain('dot-col');
    expect(td.className).toContain('octave-marker');
  });
});
