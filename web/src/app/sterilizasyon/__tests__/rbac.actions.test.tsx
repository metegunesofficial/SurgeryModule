import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RBACProvider } from '@/utils/useRBAC.jsx';

describe('Sterilizasyon RBAC actions', () => {
  it('hides Yeni Döngü Başlat when permission denied', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <RBACProvider value={{ hasPermission: (a) => a !== 'create:sterilization-cycle' }}>
          <Page />
        </RBACProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Yeni Döngü Başlat')).toBeNull();
  });

  it('shows Yeni Döngü Başlat when permission granted', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <RBACProvider value={{ hasPermission: () => true }}>
          <Page />
        </RBACProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Yeni Döngü Başlat')).toBeInTheDocument();
  });
});


