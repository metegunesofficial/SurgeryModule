import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/components/layout/Header.jsx';
import { useLayoutStore } from '@/stores/layout';

describe('Header interactions', () => {
  it('opens mobile drawer via hamburger on small screens', async () => {
    const user = userEvent.setup();
    render(<Header />);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Menüyü aç' }));
    // openSidebar sets store; Sidebar will render drawer in app, we just verify store toggled
    expect(useLayoutStore.getState().isSidebarOpen).toBe(true);
  });
});


