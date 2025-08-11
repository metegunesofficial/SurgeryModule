export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="btn-primary px-3 py-2">Hız Testi</button>
          <button className="px-3 py-2 border rounded">Rapor İndir</button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 card p-4">
          <div className="font-medium mb-2">Alan Kullanımı</div>
          <div className="h-56 bg-[var(--primary-blue-light)] rounded flex items-center justify-center text-[var(--text-gray)]">
            Chart Placeholder
          </div>
        </div>
        <div className="card p-4">
          <div className="font-medium mb-2">Performans</div>
          <div className="h-56 bg-[var(--gray-50)] rounded flex items-center justify-center text-[var(--text-gray)]">
            CPU/Memory Mock
          </div>
        </div>
        <div className="grid gap-4 xl:col-span-2">
          <div className="card p-4">
            <div className="font-medium mb-2">Bugünkü Ameliyat Çizelgesi</div>
            <ul className="space-y-2">
              {[
                { room: 'Ameliyathane 1', status: 'DEVAM EDİYOR', eta: '~30 dk' },
                { room: 'Ameliyathane 2', status: 'HAZIRLIK', eta: '16:00' },
              ].map((i, idx) => (
                <li key={idx} className="flex items-center justify-between px-3 py-2 border rounded">
                  <div className="font-medium">{i.room}</div>
                  <div className="text-sm text-[var(--text-gray)]">{i.status}</div>
                  <div className="text-sm">{i.eta}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <div className="font-medium mb-2">Son Aktiviteler</div>
            <ul className="list-disc ml-5 text-sm text-[var(--text-gray)]">
              <li>Ameliyat kaydı oluşturuldu</li>
              <li>Sterilizasyon döngüsü başlatıldı</li>
            </ul>
          </div>
        </div>
        <div className="card p-4">
          <div className="font-medium mb-2">Hızlı İstatistikler</div>
          <ul className="text-sm">
            <li>Aktif ameliyat: 1</li>
            <li>Bekleyen sterilizasyon: 2</li>
            <li>Uygun oda: 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


