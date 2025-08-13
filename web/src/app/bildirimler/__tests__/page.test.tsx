import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Bildirimler - compliance badges', () => {
  it('renders compliance badge legend', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.queryByRole('heading', { name: /Uyumluluk Rozetleri/i })).toBeTruthy();
    expect(screen.queryByText(/SKS/i)).toBeTruthy();
    expect(screen.queryByText(/JCI/i)).toBeTruthy();
  });
});


