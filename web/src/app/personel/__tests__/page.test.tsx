import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PersonelPage from '../page.jsx';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@auth/create/react', () => {
  return {
    useSession: () => ({ data: { user: { id: 'u1', name: 'Test', roles: ['viewer'] } }, status: 'authenticated' }),
  };
});

describe('PersonelPage (RBAC)', () => {
  function withRoles(roles: string[]) {
    vi.doMock('@auth/create/react', () => {
      return {
        useSession: () => ({ data: { user: { id: 'u1', name: 'Test', roles } }, status: 'authenticated' }),
      };
    });
  }

  afterEach(() => {
    vi.resetModules();
  });

  it('renders title and staff table for any user', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Personel/i })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('admin can see create and role assignment controls', async () => {
    withRoles(['admin']);
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Yeni Personel Ekle/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Rol Yönetimi/i })).toBeInTheDocument();
  });

  it('viewer cannot see create and role assignment controls', async () => {
    withRoles(['viewer']);
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: /Yeni Personel Ekle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Rol Yönetimi/i })).not.toBeInTheDocument();
  });

  it('admin can add and remove staff, toggle active, edit info, toggle permissions', async () => {
    const user = userEvent.setup();
    withRoles(['admin']);
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    // Add staff
    const before = screen.getAllByRole('row').length;
    await user.click(screen.getByRole('button', { name: /Yeni Personel Ekle/i }));
    const afterRows = await screen.findAllByRole('row');
    expect(afterRows.length).toBeGreaterThan(before);

    // Toggle active on first row
    const toggleBtn = screen.getByRole('button', { name: /Aktif Durum:/i });
    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

    // Edit first staff name and save
    const editBtn = screen.getAllByRole('button', { name: /Düzenle /i })[0];
    await user.click(editBtn);
    const nameInput = screen.getByLabelText('Ad Soyad');
    await user.clear(nameInput);
    await user.type(nameInput, 'Düzenlenen İsim');
    await user.click(screen.getByRole('button', { name: /Kaydet/i }));
    expect(screen.queryByLabelText('Ad Soyad')).not.toBeInTheDocument();

    // Toggle a permission for that staff in Permission panel
    // Pick first permission chip button
    const permBtn = screen.getAllByRole('button', { name: /izin:/i })[0];
    const wasPressed = permBtn.getAttribute('aria-pressed');
    await user.click(permBtn);
    expect(permBtn).toHaveAttribute('aria-pressed', wasPressed === 'true' ? 'false' : 'true');

    // Remove the first row (the edited one)
    const rowsBeforeDelete = screen.getAllByRole('row').length;
    const deleteBtn = screen.getAllByRole('button', { name: /Sil /i })[0];
    await user.click(deleteBtn);
    const rowsAfterDelete = screen.getAllByRole('row').length;
    expect(rowsAfterDelete).toBeLessThan(rowsBeforeDelete);
  });
});


