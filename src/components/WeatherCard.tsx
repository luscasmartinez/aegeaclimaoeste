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
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
        <p className="text-gray-500">Dados meteorológicos não disponíveis ou incompletos</p>
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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-blue-100 hover:border-blue-300"
    >
      <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-100 to-blue-200">
        <h2 className="text-2xl font-bold text-gray-800">{weather.name}</h2>
        <img src={weatherIconUrl} alt={weatherIcon.description} className="w-16 h-16" />
      </div>
      <div className="p-5">
        <p className="text-5xl font-bold text-gray-900 mb-4">{weather.main.temp.toFixed(1)}°C</p>
        <p className="text-gray-600 text-lg mb-4 capitalize">{weatherIcon.description}</p>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <span>Min: {weather.main.temp_min.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-red-500" />
            <span>Max: {weather.main.temp_max.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            <span>Umidade: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span>{precipLabel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <span>Vento: {weather.wind.speed} m/s</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-gray-500" />
            <span>Pressão: {weather.main.pressure} hPa</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunrise className="w-5 h-5 text-yellow-500" />
            <span>Nascer do Sol: {sunriseTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="w-5 h-5 text-orange-500" />
            <span>Pôr do Sol: {sunsetTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}