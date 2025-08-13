import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page from '../../uyum/page.jsx';

describe('PRD Uyum Sayfası', () => {
  it('renders totals and lists from spec JSON', () => {
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    // summary totals present
    expect(screen.getByTestId('spec-total-modules')).toBeTruthy();
    expect(screen.getByTestId('spec-total-submodules')).toBeTruthy();
    expect(screen.getByTestId('spec-total-features')).toBeTruthy();
    expect(screen.getByTestId('spec-total-equipment')).toBeTruthy();

    // requirement totals present
    expect(screen.getByTestId('spec-req-functional')).toBeTruthy();
    expect(screen.getByTestId('spec-req-performance')).toBeTruthy();
    expect(screen.getByTestId('spec-req-user')).toBeTruthy();
    expect(screen.getByTestId('spec-req-physical')).toBeTruthy();
    expect(screen.getByTestId('spec-req-legal')).toBeTruthy();
    expect(screen.getByTestId('spec-req-error_handling')).toBeTruthy();

    // standards count exists
    expect(screen.getByTestId('spec-standards-count')).toBeTruthy();
  });
});


