import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page from '../page.jsx';

describe('Sterilizasyon - SKS/JCI references', () => {
  it('renders standards references section', () => {
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    expect(screen.queryByRole('heading', { name: /SKS ve JCI Referansları/i })).toBeTruthy();
    expect(screen.queryByText(/AAMI ST79/i)).toBeTruthy();
    expect(screen.queryByText(/ISO 11140-1/i)).toBeTruthy();
  });
});


