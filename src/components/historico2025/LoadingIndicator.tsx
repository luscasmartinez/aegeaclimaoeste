import { CloudRain } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <CloudRain className="w-16 h-16 text-blue-500 dark:text-blue-400 animate-pulse mb-4" />
      <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4" />
      <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando dados climáticos...</p>
      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Isso pode levar alguns segundos</p>
    </div>
  );
}
