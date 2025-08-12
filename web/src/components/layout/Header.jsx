import { ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6">
      <div className="h-full flex items-center justify-between">
        <div className="h-10" />

        <div className="flex items-center gap-4">
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
