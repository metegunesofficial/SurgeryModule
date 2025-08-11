import {
  Home,
  Mail,
  Activity,
  Shield,
  Users,
  Heart,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  ExternalLink,
  Copy,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  Monitor,
  Thermometer,
  Scissors,
  TestTube,
} from "lucide-react";
import { useMemo, useState } from "react";

const allNotifications = [
  {
    id: "n1",
    type: "critical",
    title: "Sterilizasyon Döngüsü Hatası",
    description:
      "Ameliyathane 2'de sterilizasyon döngüsü #003 başarısız oldu. Acil müdahale gerekli.",
    time: "2 dakika önce",
    read: false,
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: "n2",
    type: "warning",
    title: "Sıcaklık Uyarısı",
    description:
      "Ameliyathane 1'de sıcaklık 25°C'ye yükseldi. Optimum aralık: 20-22°C",
    time: "15 dakika önce",
    read: false,
    icon: Thermometer,
    color: "orange",
  },
  {
    id: "n3",
    type: "system",
    title: "Sterilizasyon Döngüsü Tamamlandı",
    description:
      "Döngü #002 başarıyla tamamlandı. 24 adet cerrahi alet sterilize edildi.",
    time: "1 saat önce",
    read: false,
    icon: CheckCircle,
    color: "green",
  },
  {
    id: "n4",
    type: "system",
    title: "Personel Giriş Kaydı",
    description: "Hemşire Ayşe Kaya, Ameliyathane 1'e giriş yaptı.",
    time: "2 saat önce",
    read: true,
    icon: Users,
    color: "blue",
  },
  {
    id: "n5",
    type: "system",
    title: "Günlük Rapor Hazır",
    description:
      "10 Ağustos 2025 tarihi için günlük operasyon raporu oluşturuldu.",
    time: "3 saat önce",
    read: true,
    icon: FileText,
    color: "purple",
  },
  {
    id: "n6",
    type: "system",
    title: "Ameliyat Başarıyla Tamamlandı",
    description:
      "Dr. Atilla tarafından gerçekleştirilen implant cerrahisi başarıyla tamamlandı.",
    time: "4 saat önce",
    read: false,
    icon: Scissors,
    color: "green",
  },
  {
    id: "n7",
    type: "maintenance",
    title: "TV Ekran Sistemi Güncellendi",
    description:
      "Ameliyathane TV ekran sistemi güncellendi. Yeni hasta bilgi paneli aktif.",
    time: "6 saat önce",
    read: true,
    icon: Monitor,
    color: "indigo",
  },
  {
    id: "n8",
    type: "maintenance",
    title: "HVAC Sistemi Bakımı",
    description:
      "Ameliyathane HVAC sistemi için aylık bakım zamanı geldi. Planlama gerekli.",
    time: "Yarın",
    read: false,
    icon: Clock,
    color: "yellow",
  },
  {
    id: "n9",
    type: "maintenance",
    title: "Sterilizasyon Cihazı Kalibrasyonu",
    description:
      "Autoclave #1 için 6 aylık kalibrasyon kontrolü gerekli.",
    time: "3 gün içinde",
    read: false,
    icon: TestTube,
    color: "yellow",
  },
];

const typeMeta = {
  all: { label: "Tümü" },
  critical: { label: "Kritik" },
  system: { label: "Sistem" },
  maintenance: { label: "Bakım" },
};

export default function BildirimlerPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showRead, setShowRead] = useState(true);
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = useMemo(() => {
    const byType =
      activeType === "all"
        ? notifications
        : notifications.filter((n) => n.type === activeType);
    const byRead = showRead ? byType : byType.filter((n) => !n.read);
    const q = query.trim().toLowerCase();
    if (!q) return byRead;
    return byRead.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [notifications, activeType, showRead, query]);

  const counts = useMemo(() => {
    const base = { all: notifications.length, critical: 0, system: 0, maintenance: 0 };
    for (const n of notifications) {
      // @ts-ignore
      base[n.type] += 1;
    }
    return base;
  }, [notifications]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Atilla Dental</h1>
        </div>

        <nav className="px-4 py-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">GENEL</p>
            <div className="space-y-1">
              <a href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <div className="flex items-center justify-between px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Bildirimler</span>
                </div>
                <span className="bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AMELİYATHANE</p>
            <div className="space-y-1">
              <a href="/ameliyat-planlama" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Scissors className="w-4 h-4" />
                <span>Ameliyat Planlama</span>
              </a>
              <a href="/canli-izleme" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Canlı İzleme</span>
              </a>
              <a href="/guvenlik" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>Güvenlik</span>
              </a>
              <a href="/personel" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <Users className="w-4 h-4" />
                <span>Personel</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">STERİLİZASYON</p>
            <div className="space-y-1">
              <a href="/sterilizasyon" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                <TestTube className="w-4 h-4" />
                <span>Döngü Yönetimi</span>
              </a>
            </div>
          </div>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gray-50 rounded-md p-3 text-sm">
            <p className="text-gray-900 font-medium">Ameliyathane 1 - Ana Oda</p>
            <div className="flex gap-2 mt-2">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Copy className="w-3 h-3" />
                <span className="text-xs">Rapor Kopyala</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">Canlı İzle</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Ameliyathane
              </a>
              <a href="/sterilizasyon" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                Sterilizasyon
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-blue-600 cursor-pointer" />
              <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer" />
              <div className="flex items-center gap-2">
                <img
                  src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"
                  alt="Dr. Atilla"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Dr. Atilla</p>
                  <p className="text-gray-500 text-xs">atilla@altaydental.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <nav className="text-sm text-gray-500 mb-4">
            <span>Atilla Dental</span>
            <span className="mx-2">›</span>
            <span>Bildirimler</span>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Bildirimler</h1>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..."
                className="h-9 w-64 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={markAllRead}
                className="h-9 px-3 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Tümünü okundu işaretle
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {Object.entries(typeMeta).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                className={
                  "h-8 rounded-full px-3 text-sm border transition-colors " +
                  (activeType === key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50")
                }
              >
                {meta.label} ({counts[key] ?? 0})
              </button>
            ))}
            <label className="ml-auto inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Okunmuşları göster
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filtered.map((n) => {
              const Icon = n.icon;
              const palette = {
                red: "bg-red-50 border-red-200 text-red-900",
                orange: "bg-orange-50 border-orange-200 text-orange-900",
                green: "bg-green-50 border-green-200 text-green-900",
                blue: "bg-blue-50 border-blue-200 text-blue-900",
                purple: "bg-purple-50 border-purple-200 text-purple-900",
                indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
                yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
              }[n.color];

              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg bg-white`}
                >
                  <div
                    className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded ${palette?.replace(
                      " text-",
                      " text-"
                    )}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{n.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{n.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!n.read && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Yeni</span>
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleRead(n.id)}
                        className="h-8 rounded-md border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        {n.read ? "Okunmamış yap" : "Okundu işaretle"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
                Kriterlere uyan bildirim bulunamadı.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}