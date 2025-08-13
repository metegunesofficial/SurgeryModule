import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page from '../page.jsx';

describe('Ameliyat Planlama - SKS/JCI content', () => {
  it('renders surgical safety checklist sections (Sign-in, Time-out, Sign-out)', () => {
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    expect(screen.queryByRole('heading', { name: /Cerrahi Güvenlik Kontrol Listesi/i })).toBeTruthy();
    expect(screen.queryByText(/Sign-in/i)).toBeTruthy();
    expect(screen.queryByText(/Time-out/i)).toBeTruthy();
    expect(screen.queryByText(/Sign-out/i)).toBeTruthy();
  });
});


