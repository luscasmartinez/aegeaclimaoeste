import { CloudRain } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <CloudRain className="w-16 h-16 text-blue-500 animate-pulse mb-4" />
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Carregando dados climáticos de 2025...</p>
      <p className="text-sm text-gray-500 mt-1">Isso pode levar alguns segundos</p>
    </div>
  );
}
