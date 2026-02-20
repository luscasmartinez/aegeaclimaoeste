import { ThermometerSun, ThermometerSnowflake, CloudRain, Droplets } from 'lucide-react';
import type { YearlyStats } from '../../services/openMeteoService';

interface StatsCardsProps {
  stats: YearlyStats;
}

const cardClass =
  'flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up';

export function StatsCards({ stats }: StatsCardsProps) {
  const { hottestMonth, coldestMonth, rainiestMonth, totalPrecipitation } = stats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={cardClass} style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 shrink-0">
          <ThermometerSun className="w-5 h-5" />
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mês mais quente</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{hottestMonth.month}</p>
          <p className="text-xs text-orange-600 dark:text-orange-400">{hottestMonth.tempMax} °C</p>
        </div>
      </div>

      <div className={cardClass} style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shrink-0">
          <ThermometerSnowflake className="w-5 h-5" />
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mês mais frio</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{coldestMonth.month}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">{coldestMonth.tempMin} °C</p>
        </div>
      </div>

      <div className={cardClass} style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 shrink-0">
          <CloudRain className="w-5 h-5" />
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mês mais chuvoso</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{rainiestMonth.month}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{rainiestMonth.precipitation} mm</p>
        </div>
      </div>

      <div className={cardClass} style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-400 shrink-0">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total anual</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{totalPrecipitation} mm</p>
        </div>
      </div>
    </div>
  );
}
