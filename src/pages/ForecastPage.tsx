import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDailyForecastByCity } from '../services/weatherService';
import { DailyForecast } from '../types';
import { Navbar } from '../components/Navbar';
import { CloudRain, Calendar, Thermometer, Droplet, Wind, Sunrise, Sunset } from 'lucide-react';

export function ForecastPage() {
  const { city } = useParams<{ city: string }>();
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      fetchForecastData(city);
    }
  }, [city]);

  const fetchForecastData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyForecastByCity(cityName);
      setForecast(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar a previsão diária.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <Navbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4">Carregando previsão para {city}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <Navbar />
        <div className="text-center text-red-500 dark:text-red-400">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => city && fetchForecastData(city)} 
            className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!forecast || forecast.list.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <Navbar />
        <div className="text-center">
          <CloudRain className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-xl">Nenhuma previsão disponível para {city}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CloudRain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">Previsão para {forecast.city.name}</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Previsão para os próximos {forecast.cnt} dias</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecast.list.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const weatherIconUrl = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
            const sunriseTime = new Date(day.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sunsetTime = new Date(day.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md p-4 border border-slate-200 dark:border-slate-700 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index % 8)}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                  </h3>
                  <img src={weatherIconUrl} alt={day.weather[0].description} className="w-10 h-10" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{day.temp.day.toFixed(1)}°C</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm capitalize mb-3">{day.weather[0].description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                    <span>Min: {day.temp.min.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                    <span>Max: {day.temp.max.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplet className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                    <span>Umidade: {day.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>Vento: {day.speed} m/s</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sunrise className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
                    <span className="truncate">Nascer: {sunriseTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sunset className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                    <span className="truncate">Pôr: {sunsetTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
