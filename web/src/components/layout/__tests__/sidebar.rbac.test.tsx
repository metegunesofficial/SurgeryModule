import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar.jsx';
import { RBACProvider } from '@/utils/useRBAC.jsx';

function renderWithRBAC(hasPermission: (action: string) => boolean) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <RBACProvider value={{ hasPermission }}>
        <Sidebar />
      </RBACProvider>
    </MemoryRouter>
  );
}

describe('Sidebar RBAC visibility', () => {
  it('shows all items when hasPermission returns true', () => {
    renderWithRBAC(() => true);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ameliyat Planlama')).toBeInTheDocument();
    expect(screen.getByText('Döngü Yönetimi')).toBeInTheDocument();
    expect(screen.getByText('Yatış/Taburcu')).toBeInTheDocument();
  });

  it('hides gated items when hasPermission returns false', () => {
    renderWithRBAC((action) => {
      // deny surgery scheduling and sterilization by default in this test
      return !['create:surgery-schedule', 'create:sterilization-cycle', 'admission:create'].includes(action);
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Ameliyat Planlama')).toBeNull();
    expect(screen.queryByText('Döngü Yönetimi')).toBeNull();
    expect(screen.queryByText('Yatış/Taburcu')).toBeNull();
  });
});


