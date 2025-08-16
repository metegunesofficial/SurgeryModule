import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('virtual:load-fonts.jsx', () => ({
  LoadFonts: () => null,
}));

vi.mock('../../__create/HotReload', () => ({
  HotReloadIndicator: () => null,
}));

vi.mock('../../__create/useDevServerHeartbeat', () => ({
  useDevServerHeartbeat: () => {},
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual<any>('react-router');
  return {
    ...actual,
    useNavigate: () => () => {},
    useLocation: () => ({ pathname: '/' }),
    useAsyncError: () => null,
    useRouteError: () => null,
    Meta: () => null,
    Links: () => null,
    Scripts: () => null,
    ScrollRestoration: () => null,
  };
});

describe('Layout a11y', () => {
  it('renders skip link and main content region', async () => {
    const mod = await import('@/app/root');
    const { Layout } = mod;
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={
            <Layout>
              <div>Child content</div>
            </Layout>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Ana içeriğe atla')).toBeInTheDocument();
    expect(container.querySelector('main#main-content')).toBeTruthy();
  });
});


