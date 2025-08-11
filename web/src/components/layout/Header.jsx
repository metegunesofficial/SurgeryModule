import { Bell, HelpCircle, Award, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex space-x-8">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
          >
            Ameliyathane
          </a>
          <a
            href="/sterilizasyon"
            className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
          >
            Sterilizasyon
          </a>
          <a
            href="/tv-ekranlari"
            className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
          >
            TV Ekranları
          </a>
          <a
            href="/raporlar"
            className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
          >
            Raporlar
          </a>
          <a
            href="/uyumluluk"
            className="text-blue-600 border-b-2 border-blue-600 pb-4 text-sm font-medium"
          >
            SKS/JCI Uyumluluk
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <Award className="w-4 h-4" />
            <span>Sertifikalı</span>
          </div>
          <Bell className="w-5 h-5 text-gray-400 cursor-pointer" />
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
  );
}
