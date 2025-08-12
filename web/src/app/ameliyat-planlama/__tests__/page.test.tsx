import { render, screen } from '@testing-library/react';
import React from 'react';
import AmeliyatPlanlamaPage from '../page.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('AmeliyatPlanlamaPage', () => {
  it('renders key sections', () => {
    render(
      <MemoryRouter>
        <AmeliyatPlanlamaPage />
      </MemoryRouter>
    );

    // Left column sections
    expect(
      screen.getByRole('heading', { name: /Bugünün Programı/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Ameliyathane Durumu/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Ameliyat Öncesi Kontrol/i })
    ).toBeInTheDocument();

    // Right column sections
    expect(
      screen.getByRole('heading', { name: /Haftalık Planlama/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Yaklaşan Ameliyatlar/i })
    ).toBeInTheDocument();
  });

  it('renders world-class surgery module extra sections', () => {
    render(
      <MemoryRouter>
        <AmeliyatPlanlamaPage />
      </MemoryRouter>
    );

    // new world-class placeholders
    expect(
      screen.getByRole('heading', { name: /Kaynak Kullanımı/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Konflikt Tespiti/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Anestezi Hazırlığı/i })
    ).toBeInTheDocument();
  });

  it('shows hazırlık durumları badge on weekly plan', () => {
    render(
      <MemoryRouter>
        <AmeliyatPlanlamaPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Hazırlık Durumları/i)).toBeInTheDocument();
  });
});


