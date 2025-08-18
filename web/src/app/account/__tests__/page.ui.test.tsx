import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Account - enhanced UI', () => {
  it('renders profile, security, preferences and session sections', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Profil/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Güvenlik/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Tercihler/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Oturum/i })).toBeTruthy();
  });
});


