import { ThermometerSun, ThermometerSnowflake, CloudRain, Droplets } from 'lucide-react';
import type { YearlyStats } from '../../services/openMeteoService';

interface StatsCardsProps {
  stats: YearlyStats;
}

const cardClass =
  'flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white shadow-sm';

export function StatsCards({ stats }: StatsCardsProps) {
  const { hottestMonth, coldestMonth, rainiestMonth, totalPrecipitation } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={cardClass}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 shrink-0">
          <ThermometerSun className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <p className="text-sm font-medium text-gray-500">Mês mais quente</p>
          <p className="text-lg font-bold text-gray-800 truncate">{hottestMonth.month}</p>
          <p className="text-sm text-orange-600">{hottestMonth.tempMax} °C (média máx.)</p>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 shrink-0">
          <ThermometerSnowflake className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <p className="text-sm font-medium text-gray-500">Mês mais frio</p>
          <p className="text-lg font-bold text-gray-800 truncate">{coldestMonth.month}</p>
          <p className="text-sm text-blue-600">{coldestMonth.tempMin} °C (média mín.)</p>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 shrink-0">
          <CloudRain className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <p className="text-sm font-medium text-gray-500">Mês mais chuvoso</p>
          <p className="text-lg font-bold text-gray-800 truncate">{rainiestMonth.month}</p>
          <p className="text-sm text-slate-600">{rainiestMonth.precipitation} mm</p>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 shrink-0">
          <Droplets className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <p className="text-sm font-medium text-gray-500">Total anual de chuva</p>
          <p className="text-lg font-bold text-gray-800">{totalPrecipitation} mm</p>
        </div>
      </div>
    </div>
  );
}
