import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AtillaDentalDashboard from '../page.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard navigation', () => {
  it('has a link to /canli-izleme labeled Canlı İzleme', async () => {
    render(
      <MemoryRouter>
        <AtillaDentalDashboard />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Canlı İzleme/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/canli-izleme');

    // ensure it is clickable without throwing
    await userEvent.click(link);
  });
});
