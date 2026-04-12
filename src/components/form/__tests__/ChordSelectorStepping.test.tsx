import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChordSelector from '../ChordSelector';

const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const noop = () => {};

const defaultProps = {
  onAddToProgression: noop,
  lastProgressionChord: null,
  onPreview: noop,
  noteNames,
  useSharps: false,
  setUseSharps: noop,
};

function renderSelector(overrides: Partial<typeof defaultProps & { stepping: boolean }> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<ChordSelector {...props} />);
}

describe('ChordSelector — stepping mode', () => {
  it('does not preselect root or category in stepping mode', () => {
    renderSelector({ stepping: true });
    // No root button should have the active class
    const rootButtons = document.querySelectorAll('.chord-root-btn');
    rootButtons.forEach((btn) => {
      expect(btn.className).not.toContain('active');
    });
    // No tab button should have the active class
    const tabButtons = document.querySelectorAll('.chord-tab');
    tabButtons.forEach((btn) => {
      expect(btn.className).not.toContain('active');
    });
  });

  it('preselects root and category in non-stepping mode', () => {
    renderSelector({ stepping: false });
    // First root (C) should be active
    const activeRoot = document.querySelector('.chord-root-btn.active');
    expect(activeRoot).not.toBeNull();
    // First tab (Triad) should be active
    const activeTab = document.querySelector('.chord-tab.active');
    expect(activeTab).not.toBeNull();
  });

  it('shows step summaries with "—" when nothing is picked', () => {
    renderSelector({ stepping: true });
    const summaryValues = document.querySelectorAll('.step-summary-value');
    // Root and Category summaries visible (step 1 is expanded, so only 2 and 3 show summaries)
    // Actually step 1 is active, so steps 2 and 3 show summaries
    const dashes = Array.from(summaryValues).filter((el) => el.textContent === '—');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('clicking a root advances to step 2 and shows root in summary', async () => {
    const user = userEvent.setup();
    renderSelector({ stepping: true });

    await user.click(screen.getByText('E'));

    // Root summary should now show "E"
    const rootSummary = document.querySelectorAll('.step-summary-value');
    const rootVal = Array.from(rootSummary).find((el) => el.textContent === 'E');
    expect(rootVal).toBeDefined();

    // Root button should now have active class
    const rootButtons = document.querySelectorAll('.chord-root-btn');
    // The E button won't be visible since step 1 collapsed, but tab buttons should now be visible
    const tabButtons = document.querySelectorAll('.chord-tab');
    expect(tabButtons.length).toBeGreaterThan(0);
  });

  it('clicking a root then a category advances to step 3', async () => {
    const user = userEvent.setup();
    renderSelector({ stepping: true });

    await user.click(screen.getByText('C'));
    await user.click(screen.getByText('7th'));

    // Category summary should show "7th"
    const summaryValues = document.querySelectorAll('.step-summary-value');
    const catVal = Array.from(summaryValues).find((el) => el.textContent === '7th');
    expect(catVal).toBeDefined();

    // Quality buttons should now be visible
    const qualityButtons = document.querySelectorAll('.chord-quality-btn');
    expect(qualityButtons.length).toBeGreaterThan(0);
  });

  it('clicking a step summary navigates back to that step', async () => {
    const user = userEvent.setup();
    renderSelector({ stepping: true });

    // Advance through steps
    await user.click(screen.getByText('G'));
    await user.click(screen.getByText('Triad'));

    // Now on step 3 — click the Root summary to go back to step 1
    const rootSummary = Array.from(document.querySelectorAll('.step-summary')).find(
      (el) => el.querySelector('.step-summary-label')?.textContent === 'Root'
    );
    expect(rootSummary).toBeDefined();
    await user.click(rootSummary!);

    // Root buttons should be visible again
    const rootButtons = document.querySelectorAll('.chord-root-btn');
    expect(rootButtons.length).toBe(12);
  });

  it('add button shows "Select a quality" when no quality is picked', async () => {
    const user = userEvent.setup();
    renderSelector({ stepping: true });

    await user.click(screen.getByText('C'));
    await user.click(screen.getByText('Triad'));

    expect(screen.getByText('Select a quality')).toBeInTheDocument();
  });

  it('add button is disabled until a quality is selected', async () => {
    const user = userEvent.setup();
    renderSelector({ stepping: true });

    await user.click(screen.getByText('C'));
    await user.click(screen.getByText('Triad'));

    const addBtn = document.querySelector('.add-to-song-btn');
    expect(addBtn).not.toBeNull();
    expect(addBtn).toBeDisabled();
  });
});
