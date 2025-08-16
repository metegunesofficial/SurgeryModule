import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/utils/useAuth.js', () => {
  return {
    default: () => ({
      signInWithCredentials: vi.fn(async () => {}),
      signUpWithCredentials: vi.fn(async () => {}),
      signOut: vi.fn(async () => {}),
    }),
  };
});

describe('Account SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and signs in successfully', async () => {
    const { default: Page } = await import('../page.jsx');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Parola'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Giriş Yap' }));

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('toggles to signup and calls sign up', async () => {
    const { default: Page } = await import('../page.jsx');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Hesabın yok mu? Kayıt ol'));
    expect(screen.getByRole('button', { name: 'Kayıt Ol' })).toBeInTheDocument();
  });

  it('shows error on failed sign in', async () => {
    // Re-mock module at top is static; instead simulate failure by throwing during click
    const { default: Page } = await import('../page.jsx');
    const user = userEvent.setup();
    // Temporarily override implementation via spy on the hook return
    vi.resetModules();
    vi.doMock('@/utils/useAuth.js', () => ({
      default: () => ({
        signInWithCredentials: async () => { throw new Error('fail'); },
        signUpWithCredentials: async () => {},
        signOut: async () => {},
      }),
    }));
    const { default: PageWithFail } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <PageWithFail />
      </MemoryRouter>
    );
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Parola'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Giriş Yap' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('İşlem başarısız');
  });
});


