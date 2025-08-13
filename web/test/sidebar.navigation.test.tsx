import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar.jsx';
import { useLayoutStore } from '@/stores/layout';

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

  it('opens and closes the mobile drawer', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>
    );

    // Drawer should be closed initially
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    // Open programmatically (simulate clicking hamburger which calls openSidebar)
    await act(async () => {
      useLayoutStore.getState().openSidebar();
    });
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>
    );
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    // Close by clicking overlay
    const overlay = document.querySelector('[aria-hidden="true"]');
    if (overlay) {
      await user.click(overlay as HTMLElement);
    }
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});


