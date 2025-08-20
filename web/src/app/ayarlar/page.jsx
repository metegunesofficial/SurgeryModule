import { memo, useState, useEffect } from "react";
import {
  Settings,
  Bell,
  ShieldCheck,
  Save,
  Globe,
  SunMedium,
  Moon,
  SmartphoneNfc,
  Database,
  FileText,
  Clock,
  HardDrive,
  Wifi,
  WifiOff,
  Monitor,
  Printer,
  Archive,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

function useLocalSettings(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

function GeneralSettingsCard() {
  const [settings, setSettings] = useLocalSettings("settings:general", {
    language: "tr",
    timezone: "Europe/Istanbul",
    dateFormat: "DD/MM/YYYY",
    theme: "system",
    animations: true,
    sound: true,
    autoSave: true
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
  }, [settings.theme]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Genel Ayarlar</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Dil</span>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Saat Dilimi</span>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="Europe/Istanbul">Türkiye (GMT+3)</option>
              <option value="Europe/London">London (GMT+1)</option>
              <option value="America/New_York">New York (GMT-4)</option>
              <option value="Asia/Dubai">Dubai (GMT+4)</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Tarih Formatı</span>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-slate-700 font-medium">Tema</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setSettings({ ...settings, theme: "light" })}
                className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${
                  settings.theme === "light"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SunMedium className="w-4 h-4" /> Açık
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: "dark" })}
                className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${
                  settings.theme === "dark"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Moon className="w-4 h-4" /> Koyu
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: "system" })}
                className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${
                  settings.theme === "system"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SmartphoneNfc className="w-4 h-4" /> Sistem
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-slate-700">Animasyonlar</span>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => setSettings({ ...settings, animations: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-slate-700">Ses Efektleri</span>
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => setSettings({ ...settings, sound: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-slate-700">Otomatik Kaydet</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettingsCard() {
  const [notifications, setNotifications] = useLocalSettings("settings:notifications", {
    email: {
      appointments: true,
      reports: true,
      alerts: true,
      newsletter: false
    },
    sms: {
      urgent: true,
      appointments: false,
      reminders: true
    },
    push: {
      desktop: true,
      mobile: false
    },
    sound: true,
    desktop: true
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Bildirim Ayarları</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">E-posta Bildirimleri</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Randevu Hatırlatıcıları</span>
              <input
                type="checkbox"
                checked={notifications.email.appointments}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, appointments: e.target.checked }
                })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Rapor Bildirimleri</span>
              <input
                type="checkbox"
                checked={notifications.email.reports}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, reports: e.target.checked }
                })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Acil Uyarılar</span>
              <input
                type="checkbox"
                checked={notifications.email.alerts}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, alerts: e.target.checked }
                })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">SMS Bildirimleri</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Acil Durumlar</span>
              <input
                type="checkbox"
                checked={notifications.sms.urgent}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, urgent: e.target.checked }
                })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Randevu Bildirimleri</span>
              <input
                type="checkbox"
                checked={notifications.sms.appointments}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, appointments: e.target.checked }
                })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Diğer</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Masaüstü Bildirimleri</span>
              <input
                type="checkbox"
                checked={notifications.desktop}
                onChange={(e) => setNotifications({ ...notifications, desktop: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-700">Ses Bildirimleri</span>
              <input
                type="checkbox"
                checked={notifications.sound}
                onChange={(e) => setNotifications({ ...notifications, sound: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemSettingsCard() {
  const [system, setSystem] = useLocalSettings("settings:system", {
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 12,
    maintenanceMode: false,
    debugMode: false,
    performanceMode: "balanced"
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Sistem Ayarları</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Otomatik Yedekleme</span>
            <select
              value={system.backupFrequency}
              onChange={(e) => setSystem({ ...system, backupFrequency: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="hourly">Saatlik</option>
              <option value="daily">Günlük</option>
              <option value="weekly">Haftalık</option>
              <option value="monthly">Aylık</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Veri Saklama Süresi (Ay)</span>
            <input
              type="number"
              min="1"
              max="120"
              value={system.dataRetention}
              onChange={(e) => setSystem({ ...system, dataRetention: parseInt(e.target.value) })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Performans Modu</span>
            <select
              value={system.performanceMode}
              onChange={(e) => setSystem({ ...system, performanceMode: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="performance">Performans</option>
              <option value="balanced">Dengeli</option>
              <option value="powerSaving">Güç Tasarrufu</option>
            </select>
          </label>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-slate-700">Otomatik Yedekleme</span>
              <input
                type="checkbox"
                checked={system.autoBackup}
                onChange={(e) => setSystem({ ...system, autoBackup: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors">
              <span className="flex items-center gap-2 text-amber-800">Bakım Modu</span>
              <input
                type="checkbox"
                checked={system.maintenanceMode}
                onChange={(e) => setSystem({ ...system, maintenanceMode: e.target.checked })}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-amber-300 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-slate-700">Hata Ayıklama</span>
              <input
                type="checkbox"
                checked={system.debugMode}
                onChange={(e) => setSystem({ ...system, debugMode: e.target.checked })}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySettingsCard() {
  const [privacy, setPrivacy] = useLocalSettings("settings:privacy", {
    analytics: true,
    crashReports: true,
    usageData: false,
    location: false,
    cookies: true
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Lock className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Gizlilik ve Güvenlik</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700">Analitik Veri</span>
            <input
              type="checkbox"
              checked={privacy.analytics}
              onChange={(e) => setPrivacy({ ...privacy, analytics: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700">Çökme Raporları</span>
            <input
              type="checkbox"
              checked={privacy.crashReports}
              onChange={(e) => setPrivacy({ ...privacy, crashReports: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700">Kullanım Verisi</span>
            <input
              type="checkbox"
              checked={privacy.usageData}
              onChange={(e) => setPrivacy({ ...privacy, usageData: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700">Konum Servisleri</span>
            <input
              type="checkbox"
              checked={privacy.location}
              onChange={(e) => setPrivacy({ ...privacy, location: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
            />
          </label>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Veri Yönetimi</h3>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4" /> Verileri İndir
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
              <Archive className="w-4 h-4" /> Yedek Oluştur
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4" /> Tüm Verileri Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <main aria-labelledby="settings-title" className="space-y-6">
      <h1 id="settings-title" className="sr-only">Ayarlar</h1>

      <GeneralSettingsCard />
      <NotificationSettingsCard />
      <SystemSettingsCard />
      <PrivacySettingsCard />

      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ayarları Kaydet</h2>
          <p className="text-sm text-slate-600">Değişikliklerinizi kaydetmek için butona tıklayın.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Tümünü Kaydet
        </button>
      </div>
    </main>
  );
}

export default memo(SettingsPage);


