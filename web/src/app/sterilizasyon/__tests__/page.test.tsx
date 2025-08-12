import { render, screen } from '@testing-library/react';
import React from 'react';
import SterilizasyonPage from '../page.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('SterilizasyonPage', () => {
  it('renders key sections', () => {
    render(
      <MemoryRouter>
        <SterilizasyonPage />
      </MemoryRouter>
    );

    // Existing sections
    expect(screen.getByRole('heading', { name: /Aktif Döngüler/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cihaz Durumu/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Kalite Kontrol Testleri/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sterilizasyon Süreci/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Son Döngüler/i })).toBeInTheDocument();
  });

  it('renders world-class sterilization module extra sections', () => {
    render(
      <MemoryRouter>
        <SterilizasyonPage />
      </MemoryRouter>
    );

    // new world-class placeholders
    expect(screen.getByRole('heading', { name: /Alet Seti Hazırlığı/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /İzlenebilirlik/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Kalite Güvence Metrikleri/i })).toBeInTheDocument();
  });
});


