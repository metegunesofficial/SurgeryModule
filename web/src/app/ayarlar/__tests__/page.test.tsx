import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Ayarlar - compliance settings', () => {
  it('renders compliance and retention settings', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.queryByRole('heading', { name: /Uyumluluk/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Denetim ve Saklama/i })).toBeTruthy();
  });
});


