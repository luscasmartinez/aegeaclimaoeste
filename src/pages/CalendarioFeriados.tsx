import { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Calendar, MapPin } from 'lucide-react';
import { ALLOWED_CITIES } from '../config/cities';
import { getHolidaysForCity, type Holiday } from '../data/holidays';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2];

/** Formata nome da cidade para exibição. */
function formatCityName(name: string): string {
  const lower = name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const map: Record<string, string> = {
    Sao: 'São', Santo: 'Santo', Santa: 'Santa', Tres: 'Três',
    Missoes: 'Missões', Angelo: 'Ângelo', Antonio: 'Antônio',
    Candid: 'Cândido', Godoy: 'Godói', Esperanca: 'Esperança',
    Gaucha: 'Gaúcha', Burica: 'Buricá', Miraguai: 'Miraguaí',
    Independencia: 'Independência', Mauricio: 'Maurício',
    Inhacora: 'Inhacorá', Macambara: 'Maçambará', Humaita: 'Humaitá',
    Girua: 'Giruá', Quarai: 'Quaraí', Rosario: 'Rosário',
    Camara: 'Câmara', Teutonia: 'Teutônia', Portao: 'Portão', Goncalves: 'Gonçalves',
  };
  return Object.entries(map).reduce((s, [k, v]) => s.replace(k, v), lower);
}

function HolidayBadge({ type }: { type: Holiday['type'] }) {
  const styles = {
    nacional: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    estadual: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    municipal: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
  };
  const labels = { nacional: 'Nacional', estadual: 'RS', municipal: 'Municipal' };
  return (
    <span className={`px-2 py-0.5 rounded-xl text-xs font-medium ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

export function CalendarioFeriados() {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  const holidays = useMemo(() => {
    if (selectedCity === 'all') {
      const byDate = new Map<string, Holiday[]>();
      ALLOWED_CITIES.forEach((city) => {
        getHolidaysForCity(city, selectedYear).forEach((h) => {
          const key = h.date;
          if (!byDate.has(key)) byDate.set(key, []);
          const arr = byDate.get(key)!;
          const cityKey = h.city ?? '';
          if (!arr.some((x) => x.title === h.title && x.type === h.type && (x.city ?? '') === cityKey)) {
            arr.push(h);
          }
        });
      });
      return Array.from(byDate.entries())
        .sort(([a], [b]) => {
          const [da, ma] = a.split('/').map(Number);
          const [db, mb] = b.split('/').map(Number);
          if (ma !== mb) return ma - mb;
          return da - db;
        })
        .flatMap(([, list]) => list);
    }
    return getHolidaysForCity(selectedCity, selectedYear);
  }, [selectedCity, selectedYear]);

  const groupedByMonth = useMemo(() => {
    const months: Record<string, Holiday[]> = {};
    holidays.forEach((h) => {
      const [, month] = h.date.split('/');
      const key = month;
      if (!months[key]) months[key] = [];
      months[key].push(h);
    });
    const monthNames: Record<string, string> = {
      '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
      '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
      '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro',
    };
    return Object.entries(months)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([num, list]) => ({ month: monthNames[num] || num, list }));
  }, [holidays]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Calendário de Feriados
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Feriados nacionais, estaduais (RS) e municipais das cidades da região
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cidade</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
            >
              <option value="all">Todas as cidades (feriados gerais)</option>
              {ALLOWED_CITIES.map((city) => (
                <option key={city} value={city}>
                  {formatCityName(city)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ano</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {groupedByMonth.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p>Nenhum feriado encontrado para os filtros selecionados.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {groupedByMonth.map(({ month, list }, groupIndex) => (
                <div key={month} className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {month}
                  </h2>
                  {groupIndex === 0 && selectedCity === 'all' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 mb-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700">
                      <span className="w-14 shrink-0">Data</span>
                      <span className="flex-1 min-w-0">Nome</span>
                      <span className="shrink-0 w-24 sm:w-32">Onde é feriado</span>
                      <span className="shrink-0 w-20">Tipo</span>
                    </div>
                  )}
                  <ul className="space-y-3">
                    {list.map((h, i) => (
                      <li
                        key={`${h.date}-${h.title}-${h.city ?? ''}-${i}`}
                        className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0"
                      >
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 w-14 shrink-0">
                          {h.date}
                        </span>
                        <span className="text-slate-900 dark:text-slate-100 flex-1 min-w-0">{h.title}</span>
                        <span className="text-slate-600 dark:text-slate-400 text-sm shrink-0" title="Onde é feriado">
                          {h.type === 'nacional'
                            ? 'Brasil'
                            : h.type === 'estadual'
                              ? 'RS'
                              : h.city
                                ? formatCityName(h.city)
                                : '—'}
                        </span>
                        <HolidayBadge type={h.type} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
          Feriados municipais referem-se ao aniversário do município. Consulte a prefeitura para
          confirmar datas e pontos facultativos.
        </p>
      </div>
    </div>
  );
}
