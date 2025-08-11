export default function SterilizationPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sterilizasyon</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="card p-4">
          <div className="font-medium mb-2">Aktif Döngüler</div>
          <div className="space-y-2 text-sm text-[var(--text-gray)]">
            <div className="flex items-center justify-between">
              <span>Steam 134°C</span>
              <span>65%</span>
            </div>
            <div className="h-2 rounded bg-[var(--primary-blue-light)]" />
          </div>
        </div>
        <div className="card p-4">
          <div className="font-medium mb-2">Kuyruk</div>
          <ul className="text-sm text-[var(--text-gray)] list-disc ml-5">
            <li>Set A - 12 parça</li>
            <li>Set B - 7 parça</li>
          </ul>
        </div>
        <div className="card p-4 md:col-span-2">
          <div className="font-medium mb-2">Malzeme Takibi</div>
          <p className="text-sm text-[var(--text-gray)]">Barkod/QR takibi için placeholder bileşeni.</p>
        </div>
      </div>
    </div>
  );
}


