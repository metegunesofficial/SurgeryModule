import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Account - compliance sections', () => {
  it('renders training/certifications sections', async () => {
    const { default: Page } = await import('../page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.queryByRole('heading', { name: /Eğitim ve Yeterlilikler/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Sertifikalar/i })).toBeTruthy();
  });
});


