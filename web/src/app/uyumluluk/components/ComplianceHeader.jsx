import { Upload, Download } from "lucide-react";

export function ComplianceHeader() {
  return (
    <>
      <nav className="text-sm text-gray-500 mb-4">
        <span>Uyumluluk</span>
        <span className="mx-2">›</span>
        <span>SKS/JCI Kontrolleri</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Kalite Standartları ve Uyumluluk
        </h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Belge Yükle
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Uyumluluk Raporu
          </button>
        </div>
      </div>
    </>
  );
}
