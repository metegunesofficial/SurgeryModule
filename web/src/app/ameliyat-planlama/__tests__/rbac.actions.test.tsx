import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RBACProvider } from '@/utils/useRBAC.jsx';

describe('Ameliyat Planlama RBAC actions', () => {
  it('hides actions when permission denied', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <RBACProvider value={{ hasPermission: () => false }}>
          <Page />
        </RBACProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText('Yeni Ameliyat Planla')).toBeNull();
    expect(screen.queryByText('Detaylı kontrol çalıştır')).toBeNull();
  });

  it('shows actions when permission granted', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <RBACProvider value={{ hasPermission: () => true }}>
          <Page />
        </RBACProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Yeni Ameliyat Planla')).toBeInTheDocument();
    expect(screen.getByText('Detaylı kontrol çalıştır')).toBeInTheDocument();
  });
});


