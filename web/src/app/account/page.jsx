import { memo } from "react";
import { User, Mail, Shield } from "lucide-react";
import { useSession } from "@auth/create/react";

function AccountPage() {
  const session = useSession?.();
  const name = session?.data?.user?.name ?? "Dr. Atilla";
  const email = session?.data?.user?.email ?? "atilla@altaydental.com";

  return (
    <main aria-labelledby="account-title">
      <h1 id="account-title" className="sr-only">Hesabım</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
        </div>
        <div className="flex items-center gap-4">
          <img
            src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1"
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="text-gray-900 font-medium">{name}</div>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              <Mail className="w-4 h-4" /> {email}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Güvenlik</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Parola en az 12 karakter olmalı</li>
          <li>Şüpheli oturumlar otomatik kapatılır</li>
          <li>2FA yakında</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Eğitim ve Yeterlilikler</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>El Hijyeni Eğitimi — Yenileme: 2026/01</li>
          <li>Atık Yönetimi Eğitimi — Yenileme: 2026/03</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sertifikalar</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>BLS — Geçerlilik: 2027/05</li>
          <li>ACLS — Geçerlilik: 2026/11</li>
        </ul>
      </div>
    </main>
  );
}

export default memo(AccountPage);


