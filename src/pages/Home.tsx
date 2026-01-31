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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CloudRain className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">Informativos Meteorológicos</h1>
          </div>
          <p className="text-gray-600 text-lg">Acompanhe as previsões e análises do tempo</p>
        </div>

        <WeatherSearch onSearch={handleSearchWeather} />

        {!searchLoading && !searchError && (
          <div className="flex justify-center mb-8">
            <select
              className="p-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Buscando clima...</p>
          </div>
        )}

        {searchError && (
          <div className="text-center py-20 text-red-500">
            <p className="text-xl">{searchError}</p>
          </div>
        )}

        {currentWeather && !searchLoading && !searchError ? (
          <div className="mt-8">
            <WeatherCard weather={currentWeather} />
          </div>
        ) : loadingCities ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Carregando clima das cidades...</p>
          </div>
        ) : citiesError ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-xl">{citiesError}</p>
          </div>
        ) : filteredCitiesWeather.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCitiesWeather.map((weather, index) => (
              <WeatherCard
                key={`${weather.name}-${weather.coord?.lat ?? ''}-${weather.coord?.lon ?? ''}-${index}`}
                weather={weather}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <CloudRain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">Nenhum dado de clima disponível ou nenhuma cidade nesta macro-região.</p>
          </div>
        )}
      </div>

    </div>
  );
}