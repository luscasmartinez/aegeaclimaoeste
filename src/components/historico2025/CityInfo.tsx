import { MapPin } from 'lucide-react';
import type { CityLocation } from '../../services/openMeteoService';

interface CityInfoProps {
  city: CityLocation | null;
  year?: number;
}

export function CityInfo({ city, year = 2025 }: CityInfoProps) {
  if (!city) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
        <MapPin className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{city.name}</h2>
        <p className="text-gray-600">
          {city.country}
          <span className="text-gray-400 ml-2">• Dados de {year}</span>
        </p>
      </div>
    </div>
  );
}
