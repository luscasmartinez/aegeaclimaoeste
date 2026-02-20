import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WeatherInfo } from '../types';
import { WeatherCard } from '../components/WeatherCard';
import { Navbar } from '../components/Navbar';
import { CloudRain } from 'lucide-react';
import { WeatherSearch } from '../components/WeatherSearch'; // Importar WeatherSearch
import { fetchWeatherByCity } from '../services/weatherService';
import { ALLOWED_CITIES, MACRO_REGION_OPTIONS, getMacroRegionForCity } from '../config/cities';

export function Home() {
  const [firebaseWeatherData, setFirebaseWeatherData] = useState<WeatherInfo[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [displayedCitiesWeather, setDisplayedCitiesWeather] = useState<WeatherInfo[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [filterMacro, setFilterMacro] = useState<string>('all');

  useEffect(() => {
    fetchFirebaseWeatherData();
    fetchAllAllowedCitiesWeather();
  }, []);

  const fetchAllAllowedCitiesWeather = async () => {
    setLoadingCities(true);
    setCitiesError(null);
    const fetchedData: WeatherInfo[] = [];
    for (const city of ALLOWED_CITIES) {
      try {
        const data = await fetchWeatherByCity(city);
        fetchedData.push(data);
      } catch {
        // Cidade não encontrada na API ou fora do Brasil; omitida da lista (sem poluir o console).
      }
    }
    setDisplayedCitiesWeather(fetchedData);
    setLoadingCities(false);
  };

  const fetchFirebaseWeatherData = async () => {
    try {
      const q = query(collection(db, 'meteorologia'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: WeatherInfo[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as WeatherInfo);
      });
      setFirebaseWeatherData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do Firebase:', error);
    } finally {
      setLoadingFirebase(false);
    }
  };

  const handleSearchWeather = async (city: string) => {
    setSearchLoading(true);
    setSearchError(null);
    setCurrentWeather(null);
    try {
        const foundCity = displayedCitiesWeather.find(
            (weatherItem) => weatherItem.name.toUpperCase() === city.toUpperCase()
        );

        if (foundCity) {
            setCurrentWeather(foundCity);
        } else {
            const data = await fetchWeatherByCity(city);
            setCurrentWeather(data);
        }
    } catch (error: any) {
        setSearchError(error.message || 'Ocorreu um erro ao buscar o clima.');
    } finally {
        setSearchLoading(false);
    }
  };

  const filteredCitiesWeather = displayedCitiesWeather.filter((weather) => {
    if (filterMacro === 'all') return true;
    const macro = getMacroRegionForCity(weather.name);
    return macro === filterMacro;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CloudRain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">Informativos Meteorológicos</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Acompanhe as previsões e análises do tempo</p>
        </div>

        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <WeatherSearch onSearch={handleSearchWeather} />
        </div>

        {!searchLoading && !searchError && (
          <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <select
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              value={filterMacro}
              onChange={(e) => setFilterMacro(e.target.value)}
            >
              {MACRO_REGION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {searchLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Buscando clima...</p>
          </div>
        )}

        {searchError && (
          <div className="text-center py-20 text-red-500 dark:text-red-400">
            <p className="text-xl">{searchError}</p>
          </div>
        )}

        {currentWeather && !searchLoading && !searchError ? (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <WeatherCard weather={currentWeather} />
          </div>
        ) : loadingCities ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Carregando clima das cidades...</p>
          </div>
        ) : citiesError ? (
          <div className="text-center py-20 text-red-500 dark:text-red-400">
            <p className="text-xl">{citiesError}</p>
          </div>
        ) : filteredCitiesWeather.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {filteredCitiesWeather.map((weather, index) => (
              <div
                key={`${weather.name}-${weather.coord?.lat ?? ''}-${weather.coord?.lon ?? ''}-${index}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index % 8)}s` }}
              >
                <WeatherCard weather={weather} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <CloudRain className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-xl">Nenhum dado de clima disponível ou nenhuma cidade nesta macro-região.</p>
          </div>
        )}
      </div>
    </div>
  );
}