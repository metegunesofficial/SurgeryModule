import { memo, useState } from "react";
import { Settings, Bell, ShieldCheck, Save } from "lucide-react";

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <main aria-labelledby="settings-title">
      <h1 id="settings-title" className="sr-only">Ayarlar</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Genel</h2>
        </div>
        <div className="space-y-4 text-sm">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded">
            <span className="flex items-center gap-2 text-gray-700">
              <Bell className="w-4 h-4" /> Bildirimleri Aç
            </span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded">
            <span className="flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4" /> Haftalık Rapor E-postası
            </span>
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
              className="h-4 w-4"
            />
          </label>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
            <Save className="w-4 h-4" /> Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Uyumluluk</h2>
        </div>
        <div className="space-y-4 text-sm">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded">
            <span className="text-gray-700">JCI Denetim Modu</span>
            <input type="checkbox" className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded">
            <span className="text-gray-700">SKS Haftalık Rapor E-postası</span>
            <input type="checkbox" className="h-4 w-4" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Denetim ve Saklama</h2>
        </div>
        <div className="space-y-4 text-sm">
          <div className="p-3 border border-gray-200 rounded">
            <div className="text-gray-700">Audit log saklama süresi: 12 ay</div>
            <div className="text-xs text-gray-500">Veri saklama politikaları kurum yönergelerine tabidir</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(SettingsPage);


