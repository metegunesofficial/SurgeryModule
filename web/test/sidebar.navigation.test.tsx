import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar.jsx';

function AppShell() {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: 256 }}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home</div>} />
          <Route path="/bildirimler" element={<div data-testid="notifications">Bildirimler</div>} />
        </Routes>
      </div>
    </div>
  );
}

describe('Sidebar navigation', () => {
  it('navigates to Bildirimler within the app (SPA) without full reload', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>
    );

    // Initially on home
    expect(screen.getByTestId('home')).toBeInTheDocument();

    // Click Bildirimler in the sidebar
    await user.click(screen.getByText('Bildirimler'));

    // The notifications route should render within the same app shell
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
  });
});


