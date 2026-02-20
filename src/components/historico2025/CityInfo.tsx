import { MapPin } from 'lucide-react';
import type { CityLocation } from '../../services/openMeteoService';

interface CityInfoProps {
  city: CityLocation | null;
  year?: number;
}

export function CityInfo({ city, year = 2025 }: CityInfoProps) {
  if (!city) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shrink-0">
        <MapPin className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{city.name}</h2>
        <p className="text-slate-600 dark:text-slate-400">
          {city.country}
          <span className="text-slate-400 dark:text-slate-500 ml-2">• Dados de {year}</span>
        </p>
      </div>
    </div>
  );
}
