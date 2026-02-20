import { Thermometer, Droplet, Wind, Sunrise, Sunset, Gauge, CloudRain } from 'lucide-react';
import { WeatherInfo } from '../types';
import { useNavigate } from 'react-router-dom';

interface WeatherCardProps {
  weather: WeatherInfo;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const navigate = useNavigate();

  if (!weather || !weather.weather || weather.weather.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 animate-fade-in-up">
        <p className="text-slate-500 dark:text-slate-400">Dados meteorológicos não disponíveis ou incompletos</p>
      </div>
    );
  }

  const weatherIcon = weather.weather[0];
  const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIcon.icon}.png`;
  const sunriseTime = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const rainMm = weather.rain?.['1h'] ?? weather.rain?.['3h'] ?? null;
  const snowMm = weather.snow?.['1h'] ?? weather.snow?.['3h'] ?? null;
  const precipLabel = rainMm != null ? `Chuva: ${rainMm} mm` : snowMm != null ? `Neve: ${snowMm} mm` : 'Chuva: —';

  const handleCardClick = () => {
    navigate(`/forecast/${weather.name}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 animate-fade-in-up"
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-100 dark:from-blue-900 to-blue-200 dark:to-blue-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{weather.name}</h2>
        <img src={weatherIconUrl} alt={weatherIcon.description} className="w-14 h-14" />
      </div>
      <div className="p-4">
        <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">{weather.main.temp.toFixed(1)}°C</p>
        <p className="text-slate-600 dark:text-slate-400 text-base mb-4 capitalize">{weatherIcon.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Min: {weather.main.temp_min.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span>Max: {weather.main.temp_max.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Umidade: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="truncate">{precipLabel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Vento: {weather.wind.speed} m/s</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Pressão: {weather.main.pressure} hPa</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunrise className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="truncate">Nascer: {sunriseTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span className="truncate">Pôr: {sunsetTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}