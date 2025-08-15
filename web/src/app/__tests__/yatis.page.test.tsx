import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('YatisPage', () => {
  it('renders and allows switching tabs', async () => {
    const { default: Page } = await import('../yatis/page.jsx');
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Hasta Yatış/i })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Transfer/i }));
    await user.click(screen.getByRole('button', { name: /Taburcu/i }));
  }, 10000);
});


