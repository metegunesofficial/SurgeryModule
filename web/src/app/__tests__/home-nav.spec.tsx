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

  it('renders links to Aktivite and Görevler through CTA buttons', () => {
    render(
      <MemoryRouter>
        <AtillaDentalDashboard />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('link', { name: /Tümünü Gör/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.some((a) => a.getAttribute('href') === '/aktivite')).toBe(true);
    expect(links.some((a) => a.getAttribute('href') === '/gorevler')).toBe(true);
  });
});
