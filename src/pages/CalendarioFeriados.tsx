import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Calendar, MapPin, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { ALLOWED_CITIES } from '../config/cities';
import {
  getFeriadosCidade,
  getIbgeForCity,
  hasApiKey,
  type Feriado,
  type FeriadoTipo,
} from '../services/feriadosApiService';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1; // 1-12
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2];

const MONTH_NAMES: Record<number, string> = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
  5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
  9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro',
};

type TabId = 'mes' | 'cidade';

interface CityFeriados {
  cityName: string;
  cityDisplayName: string;
  ibge: string;
  feriados: Feriado[];
}

/** Extrai o mês (1-12) de uma data DD/MM/YYYY */
function getMonthFromDate(data: string): number {
  const parts = data.split('/');
  return parts.length >= 2 ? parseInt(parts[1], 10) : 0;
}

/** Formata nome da cidade para exibição */
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
    Ijuis: 'Ijuís',
  };
  return Object.entries(map).reduce((s, [k, v]) => s.replace(new RegExp(k, 'gi'), v), lower);
}

/** Badge colorido por tipo de feriado */
function FeriadoBadge({ tipo }: { tipo: FeriadoTipo }) {
  const styles: Record<FeriadoTipo, string> = {
    NACIONAL: 'bg-blue-100 text-blue-800',
    ESTADUAL: 'bg-green-100 text-green-800',
    MUNICIPAL: 'bg-amber-100 text-amber-800',
    FACULTATIVO: 'bg-purple-100 text-purple-700',
  };
  const labels: Record<FeriadoTipo, string> = {
    NACIONAL: 'Nacional',
    ESTADUAL: 'Estadual',
    MUNICIPAL: 'Municipal',
    FACULTATIVO: 'Facultativo',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[tipo]}`}>
      {labels[tipo]}
    </span>
  );
}

export function CalendarioFeriados() {
  const [activeTab, setActiveTab] = useState<TabId>('mes');
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedCity, setSelectedCity] = useState<string>(ALLOWED_CITIES[0]);
  const [allCitiesFeriados, setAllCitiesFeriados] = useState<CityFeriados[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  const apiKeyConfigured = hasApiKey();

  /** Carrega feriados de todas as cidades */
  const loadAllCities = useCallback(async () => {
    if (!apiKeyConfigured) return;
    
    setLoading(true);
    setError(null);
    setAllCitiesFeriados([]);
    
    const citiesWithIbge = ALLOWED_CITIES
      .map((name) => ({ name, ibge: getIbgeForCity(name) }))
      .filter((c): c is { name: string; ibge: string } => c.ibge !== null);
    
    setLoadingProgress({ current: 0, total: citiesWithIbge.length });
    
    const results: CityFeriados[] = [];
    
    for (let i = 0; i < citiesWithIbge.length; i++) {
      const { name, ibge } = citiesWithIbge[i];
      try {
        const response = await getFeriadosCidade(ibge, selectedYear);
        results.push({
          cityName: name,
          cityDisplayName: response.cidade.nome,
          ibge,
          feriados: response.feriados,
        });
      } catch (err) {
        console.warn(`Erro ao carregar feriados de ${name}:`, err);
        // Continua com as outras cidades
      }
      setLoadingProgress({ current: i + 1, total: citiesWithIbge.length });
    }
    
    setAllCitiesFeriados(results);
    setLoading(false);
  }, [selectedYear, apiKeyConfigured]);

  // Carrega dados quando muda o ano
  useEffect(() => {
    loadAllCities();
  }, [loadAllCities]);

  /** Cidades que têm feriado no mês atual */
  const citiesWithHolidayThisMonth = useMemo(() => {
    const month = CURRENT_MONTH;
    
    return allCitiesFeriados
      .map((city) => {
        const feriadosNoMes = city.feriados.filter((f) => getMonthFromDate(f.data) === month);
        return { ...city, feriadosNoMes };
      })
      .filter((city) => city.feriadosNoMes.length > 0)
      .sort((a, b) => a.cityDisplayName.localeCompare(b.cityDisplayName));
  }, [allCitiesFeriados]);

  /** Feriados da cidade selecionada, agrupados por mês */
  const selectedCityFeriados = useMemo(() => {
    const cityData = allCitiesFeriados.find((c) => c.cityName === selectedCity);
    if (!cityData) return { city: null, byMonth: [] };
    
    const byMonth: Record<number, Feriado[]> = {};
    cityData.feriados.forEach((f) => {
      const month = getMonthFromDate(f.data);
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(f);
    });
    
    return {
      city: cityData,
      byMonth: Object.entries(byMonth)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([num, feriados]) => ({
          month: Number(num),
          monthName: MONTH_NAMES[Number(num)],
          feriados: feriados.sort((a, b) => a.data.localeCompare(b.data)),
        })),
    };
  }, [allCitiesFeriados, selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Calendário de Feriados
            </h1>
          </div>
          <p className="text-gray-600">
            Feriados nacionais, estaduais e municipais via Feriados API
          </p>
        </header>

        {/* Aviso se API não configurada */}
        {!apiKeyConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Chave da API não configurada</p>
              <p className="text-sm text-amber-700 mt-1">
                Defina <code className="bg-amber-100 px-1 rounded">VITE_FERIADOS_API_KEY</code> no
                arquivo <code className="bg-amber-100 px-1 rounded">.env</code> e reinicie o servidor.
              </p>
            </div>
          </div>
        )}

        {apiKeyConfigured && (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('mes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'mes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Este Mês
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cidade')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'cidade'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Por Cidade
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {activeTab === 'cidade' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {ALLOWED_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {formatCityName(city)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className={activeTab === 'cidade' ? 'w-full sm:w-40' : 'w-full sm:w-48'}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-blue-100">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 mb-2">Carregando feriados...</p>
                <p className="text-sm text-gray-500">
                  {loadingProgress.current} de {loadingProgress.total} cidades
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${loadingProgress.total > 0 ? (loadingProgress.current / loadingProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Erro */}
            {!loading && error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Erro ao carregar feriados</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Conteúdo */}
            {!loading && !error && (
              <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                {/* Aba: Este Mês */}
                {activeTab === 'mes' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      {MONTH_NAMES[CURRENT_MONTH]} de {selectedYear} — Cidades com Feriado
                    </h2>

                    {citiesWithHolidayThisMonth.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma cidade da região tem feriado neste mês.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {citiesWithHolidayThisMonth.map(({ cityName, cityDisplayName, feriadosNoMes }) => (
                          <div
                            key={cityName}
                            className="border border-gray-100 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-sm transition-shadow"
                          >
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              {cityDisplayName}
                            </h3>
                            <ul className="space-y-2">
                              {feriadosNoMes.map((f) => (
                                <li
                                  key={`${f.data}-${f.nome}`}
                                  className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 border-b border-gray-100 last:border-0"
                                >
                                  <span className="font-mono font-semibold text-gray-700 w-24 text-sm">
                                    {f.data}
                                  </span>
                                  <span className="text-gray-800 flex-1">{f.nome}</span>
                                  <FeriadoBadge tipo={f.tipo} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Aba: Por Cidade */}
                {activeTab === 'cidade' && (
                  <div>
                    {selectedCityFeriados.city && (
                      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <Building2 className="w-6 h-6 text-blue-600" />
                          {selectedCityFeriados.city.cityDisplayName}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedCityFeriados.city.feriados.length} feriados em {selectedYear}
                        </p>
                      </div>
                    )}

                    {selectedCityFeriados.byMonth.length === 0 ? (
                      <div className="p-12 text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum feriado encontrado para esta cidade.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {selectedCityFeriados.byMonth.map(({ month, monthName, feriados }) => (
                          <div key={month} className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              {monthName}
                            </h3>
                            <ul className="space-y-3">
                              {feriados.map((f, i) => (
                                <li
                                  key={`${f.data}-${f.nome}-${i}`}
                                  className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 border-b border-gray-50 last:border-0"
                                >
                                  <span className="font-mono font-semibold text-gray-700 w-24 text-sm">
                                    {f.data}
                                  </span>
                                  <span className="text-gray-800 flex-1">{f.nome}</span>
                                  <FeriadoBadge tipo={f.tipo} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          Dados via <a href="https://www.feriadosapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Feriados API</a>.
          Feriados municipais incluem aniversário do município.
        </p>
      </div>
    </div>
  );
}
