import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../page.jsx';

describe('Dashboard sections', () => {
  it('renders Görevler, Genel Bakış (Aktivite Akışı) and Randevular', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Görevler/i)).toBeInTheDocument();
    expect(screen.getByText(/Genel Bakış \(Aktivite Akışı\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Randevular/i)).toBeInTheDocument();

    // Old chart-only layout should not be present anymore
    expect(screen.queryByText(/Ameliyathane Randevuları/i)).toBeNull();
    expect(screen.queryByText(/Sterilizasyon Randevuları/i)).toBeNull();
    expect(screen.queryByText(/Oda Durumları/i)).toBeNull();
  });
});


