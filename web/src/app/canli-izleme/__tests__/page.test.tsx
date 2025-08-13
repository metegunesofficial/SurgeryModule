import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page from '../page.jsx';

describe('Canlı İzleme - SKS/JCI content', () => {
  it('renders aseptic, door access and hand hygiene sections', () => {
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );

    expect(screen.queryByRole('heading', { name: /Aseptik Alan Uyarıları/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Kapı Erişimi ve Hareket/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /El Hijyeni ve Temas Süreleri/i })).toBeTruthy();
  });
});


