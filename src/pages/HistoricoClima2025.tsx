import { useState, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import {
  SearchBar,
  CityInfo,
  TemperatureChart,
  RainfallChart,
  StatsCards,
  LoadingIndicator,
  ErrorMessage,
} from '../components/historico2025';
import { fetchArchive2025 } from '../services/openMeteoService';
import type { CityLocation, YearlyStats } from '../services/openMeteoService';
import { BarChart3 } from 'lucide-react';

const YEAR = 2025;

export function HistoricoClima2025() {
  const [city, setCity] = useState<CityLocation | null>(null);
  const [stats, setStats] = useState<YearlyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (selectedCity: CityLocation) => {
    setCity(selectedCity);
    setError(null);
    setStats(null);
    setLoading(true);
    try {
      const data = await fetchArchive2025(
        selectedCity.latitude,
        selectedCity.longitude,
        selectedCity.timezone
      );
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setError(null);
    if (city) loadWeather(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BarChart3 className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Histórico Climático {YEAR}
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Consulte dados climáticos históricos de qualquer cidade para o ano de {YEAR}, com
            gráficos comparativos mês a mês. Dados via Open-Meteo (API gratuita).
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar onSelectCity={loadWeather} disabled={loading} />
        </div>

        {loading && <LoadingIndicator />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && city && stats && (
          <div className="space-y-8">
            <CityInfo city={city} year={YEAR} />

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo do ano</h2>
              <StatsCards stats={stats} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TemperatureChart data={stats.monthlyData} />
              <RainfallChart data={stats.monthlyData} />
            </section>
          </div>
        )}

        {!loading && !error && !city && (
          <div className="text-center py-16 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Digite o nome de uma cidade e clique em Buscar para ver o histórico de {YEAR}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
