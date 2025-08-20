import { memo, useEffect, useMemo, useState } from "react";
import { User, Mail, Shield, Camera, Save, Globe, Moon, SunMedium, Bell, Lock, SmartphoneNfc, LogOut } from "lucide-react";
import { useSession } from "@auth/create/react";
import upload from "@/app/api/utils/upload.js";

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

function ProfileCard({ userEmail, defaultName }) {
  const [profile, setProfile] = useLocalSettings(`account:profile:${userEmail}`, {
    name: defaultName,
    title: "Uzman Hekim",
    phone: "",
    department: "Cerrahi",
    avatarUrl: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
  });
  const [saving, setSaving] = useState(false);

  async function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await upload({ base64 });
      setProfile((p) => ({ ...p, avatarUrl: res.url }));
    } catch {
      /* swallow: offline-safe */
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Profil</h2>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-20 h-20">
          <img src={profile.avatarUrl} alt={profile.name} className="w-20 h-20 rounded-full object-cover border" />
          <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer shadow-sm hover:bg-blue-600 transition-colors">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <label className="text-sm">
            <span className="text-slate-700 font-medium">Ad Soyad</span>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </label>
          <label className="text-sm">
            <span className="text-slate-700 font-medium">Ünvan</span>
            <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </label>
          <label className="text-sm">
            <span className="text-slate-700 font-medium">Telefon</span>
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </label>
          <label className="text-sm">
            <span className="text-slate-700 font-medium">Birim</span>
            <input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </label>
        </div>
      </div>
      <div className="mt-4">
        <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Kaydet
        </button>
      </div>
    </div>
  );
}

function SecurityCard() {
  const [state, setState] = useState({ current: "", next: "", confirm: "" });
  const [message, setMessage] = useState("");
  const canSubmit = state.next.length >= 12 && state.next === state.confirm;
  function submit(e) {
    e.preventDefault();
    setMessage(canSubmit ? "Parola güncellendi." : "Parola kurallarına uymuyor.");
  }
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Güvenlik</h2>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <label className="text-sm">
          <span className="text-slate-700 font-medium">Mevcut Parola</span>
          <input type="password" value={state.current} onChange={(e) => setState({ ...state, current: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </label>
        <label className="text-sm">
          <span className="text-slate-700 font-medium">Yeni Parola</span>
          <input type="password" value={state.next} onChange={(e) => setState({ ...state, next: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </label>
        <label className="text-sm">
          <span className="text-slate-700 font-medium">Yeni Parola (Tekrar)</span>
          <input type="password" value={state.confirm} onChange={(e) => setState({ ...state, confirm: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </label>
        <div className="sm:col-span-3 flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm" disabled={!canSubmit}>
            <Lock className="w-4 h-4" /> Parolayı Güncelle
          </button>
          {message && <span className={`text-sm ${canSubmit ? 'text-green-600' : 'text-red-600'}`} role="status">{message}</span>}
        </div>
      </form>
      <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-4">
        <li>Parola en az 12 karakter olmalı</li>
        <li>Şüpheli oturumlar otomatik kapatılır</li>
        <li>2FA yakında</li>
      </ul>
    </div>
  );
}

function PreferencesCard() {
  const [prefs, setPrefs] = useLocalSettings("account:prefs", {
    language: "tr",
    theme: "system",
    notificationsEmail: true,
    notificationsSms: false,
  });
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
  }, [prefs.theme]);
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-900">Tercihler</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <label className="text-sm">
          <span className="text-slate-700 font-medium">Dil</span>
          <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </label>
        <div>
          <span className="text-slate-700 font-medium">Tema</span>
          <div className="mt-1 flex items-center gap-2">
            <button onClick={() => setPrefs({ ...prefs, theme: "light" })} className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${prefs.theme === "light" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
              <SunMedium className="w-4 h-4" /> Açık
            </button>
            <button onClick={() => setPrefs({ ...prefs, theme: "dark" })} className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${prefs.theme === "dark" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
              <Moon className="w-4 h-4" /> Koyu
            </button>
            <button onClick={() => setPrefs({ ...prefs, theme: "system" })} className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md transition-colors ${prefs.theme === "system" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
              <SmartphoneNfc className="w-4 h-4" /> Sistem
            </button>
          </div>
        </div>
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700"><Bell className="w-4 h-4" /> E-posta Bildirimleri</span>
            <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded" checked={prefs.notificationsEmail} onChange={(e) => setPrefs({ ...prefs, notificationsEmail: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2 text-slate-700"><Bell className="w-4 h-4" /> SMS Bildirimleri</span>
            <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded" checked={prefs.notificationsSms} onChange={(e) => setPrefs({ ...prefs, notificationsSms: e.target.checked })} />
          </label>
        </div>
      </div>
    </div>
  );
}

function ComplianceCard() {
  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Eğitim ve Yeterlilikler</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>El Hijyeni Eğitimi — Yenileme: 2026/01</li>
          <li>Atık Yönetimi Eğitimi — Yenileme: 2026/03</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Sertifikalar</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>BLS — Geçerlilik: 2027/05</li>
          <li>ACLS — Geçerlilik: 2026/11</li>
        </ul>
      </div>
    </>
  );
}

function SessionActions() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Oturum</h2>
          <p className="text-sm text-slate-600">Tarayıcı oturumunu güvenle yönet.</p>
        </div>
        <a href="/account/logout" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors shadow-sm">
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </a>
      </div>
    </div>
  );
}

function AccountPage() {
  const session = useSession?.();
  const name = session?.data?.user?.name ?? "Dr. Atilla";
  const email = session?.data?.user?.email ?? "atilla@altaydental.com";

  return (
    <main aria-labelledby="account-title" className="space-y-6">
      <h1 id="account-title" className="sr-only">Hesabım</h1>

      <ProfileCard userEmail={email} defaultName={name} />
      <SecurityCard />
      <PreferencesCard />
      <ComplianceCard />
      <SessionActions />
    </main>
  );
}

export default memo(AccountPage);


