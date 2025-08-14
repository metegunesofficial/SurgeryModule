import { render, screen } from '@testing-library/react';
import AtillaDentalDashboard from '../page.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard navigation cleanup', () => {
  it('does not render quick links like Canlı İzleme on the dashboard', () => {
    render(
      <MemoryRouter>
        <AtillaDentalDashboard />
      </MemoryRouter>
    );
    expect(screen.queryByRole('link', { name: /Canlı İzleme/i })).toBeNull();
  });

  it('renders links to Aktivite and Görevler through clickable headers', () => {
    render(
      <MemoryRouter>
        <AtillaDentalDashboard />
      </MemoryRouter>
    );
    const act = screen.getByRole('link', { name: /Genel Bakış \(Aktivite Akışı\)/i });
    const tasks = screen.getByRole('link', { name: /Görevler/i });
    expect(act.getAttribute('href')).toBe('/aktivite');
    expect(tasks.getAttribute('href')).toBe('/gorevler');
  });
});
