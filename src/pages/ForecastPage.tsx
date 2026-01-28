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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Carregando previsão para {city}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">Erro: {error}</p>
          <button onClick={() => city && fetchForecastData(city)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Tentar Novamente</button>
        </div>
      </div>
    );
  }

  if (!forecast || forecast.list.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CloudRain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl">Nenhuma previsão disponível para {city}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CloudRain className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">Previsão para {forecast.city.name}</h1>
          </div>
          <p className="text-gray-600 text-lg">Previsão para os próximos {forecast.cnt} dias</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forecast.list.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const weatherIconUrl = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
            const sunriseTime = new Date(day.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sunsetTime = new Date(day.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                  </h3>
                  <img src={weatherIconUrl} alt={day.weather[0].description} className="w-12 h-12" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{day.temp.day.toFixed(1)}°C</p>
                <p className="text-gray-600 text-lg capitalize mb-4">{day.weather[0].description}</p>

                <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <span>Min: {day.temp.min.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span>Max: {day.temp.max.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <span>Umidade: {day.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span>Vento: {day.speed} m/s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sunrise className="w-4 h-4 text-yellow-500" />
                    <span>Nascer: {sunriseTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sunset className="w-4 h-4 text-orange-500" />
                    <span>Pôr: {sunsetTime}</span>
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
