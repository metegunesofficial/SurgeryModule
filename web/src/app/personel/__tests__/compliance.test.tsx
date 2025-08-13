import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Personel - compliance content', () => {
  it('renders training compliance and competency matrix', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.queryByRole('heading', { name: /Eğitim Uygunluğu/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Yetkinlik Matriksi/i })).toBeTruthy();
  });
});


