import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../page.jsx';

describe('Dashboard compliance widgets', () => {
  it('renders IPSG, sterilization, incidents, audit, training cards', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // These will be implemented as headings/buttons in the page
    const expectations = [
      /Hasta Güvenliği Hedefleri/i,
      /Sterilizasyon Kalite Göstergeleri/i,
      /Olay Bildirimleri/i,
      /Dokümantasyon ve Denetim/i,
      /Eğitim Uyumu/i,
    ];
    for (const pattern of expectations) {
      expect(screen.queryByText(pattern)).toBeTruthy();
    }
  });
});


