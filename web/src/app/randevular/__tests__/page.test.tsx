import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RandevularPage from '../../randevular/page.jsx';

describe('Randevular - süre kalıcılığı', () => {
  it('süre 15 dk yapılıp kaydedildiğinde tekrar açıldığında 15 olarak gelir', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RandevularPage />
      </MemoryRouter>
    );

    // Varsayılan ilk etkinliği aç (Diş çekimi (A01))
    const firstEvent = await screen.findByText(/Diş çekimi \(A01\)/i);
    await user.click(firstEvent);

    // Modal içinde "Süre (dk)" label'ının bulunduğu alandaki select elementini bul
    const durationLabel = await screen.findByText('Süre (dk)');
    const durationSelect = durationLabel.parentElement?.querySelector('select') as HTMLSelectElement;
    expect(durationSelect).toBeTruthy();

    // 15 dk seç ve Kaydet
    await user.selectOptions(durationSelect, '15');
    await user.click(screen.getByRole('button', { name: /Kaydet/i }));

    // Aynı etkinliği tekrar aç
    await user.click(firstEvent);

    // Sürenin 15 olarak geldiğini doğrula
    const durationLabel2 = await screen.findByText('Süre (dk)');
    const durationSelect2 = durationLabel2.parentElement?.querySelector('select') as HTMLSelectElement;
    expect(durationSelect2).toBeTruthy();
    expect(durationSelect2.value).toBe('15');
  });
});


describe('Randevular - doktor göster toggle', () => {
  it('toggle açıkken kartta doktor bilgisi görünsün', async () => {
    const user = userEvent.setup();
    // Ayarları önceden aç: showDoctor true
    window.localStorage.setItem('appointments_settings_v1', JSON.stringify({ fontSizePx: 12, fontWeight: 500, slotSnapMinutes: 10, indicatorSizePx: 2, showDoctor: true }));

    render(
      <MemoryRouter>
        <RandevularPage />
      </MemoryRouter>
    );

    const firstEvent = await screen.findByText(/Diş çekimi \(A01\)/i);
    // Kartta doktor bilgisinin render edildiğini doğrula
    const matches = await screen.findAllByText(/Dr\. Atilla/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});


