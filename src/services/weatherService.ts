import { OPEN_WEATHER_API_KEY, OPEN_WEATHER_API_ENDPOINT } from '../config/openWeather';
import { WeatherInfo, DailyForecast } from '../types';

const KELVIN_OFFSET = 273.15;

export const OPEN_WEATHER_DAILY_FORECAST_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast/daily";

export const fetchWeatherByCity = async (city: string): Promise<WeatherInfo> => {
  try {
    const url = `${OPEN_WEATHER_API_ENDPOINT}?q=${city}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
    const response = await fetch(url);

    if (!response.ok) {
      // Tratar erros específicos da API
      if (response.status === 404) {
        throw new Error('Cidade não encontrada. Verifique o nome da cidade.');
      }
      if (response.status === 401) {
        throw new Error('Chave de API inválida. Verifique sua configuração.');
      }
      // Tentativa de obter mensagem de erro da API para outros erros
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status}`);
      } catch (jsonError) {
        // Se não conseguir parsear o JSON, assume erro de rede/servidor sem mensagem específica
        throw new Error(`Erro de rede ou servidor: ${response.status}`);
      }
    }

    const data: WeatherInfo = await response.json();

    // Convert Kelvin to Celsius for relevant temperature fields
    data.main.temp = data.main.temp - KELVIN_OFFSET;
    data.main.temp_min = data.main.temp_min - KELVIN_OFFSET;
    data.main.temp_max = data.main.temp_max - KELVIN_OFFSET;
    data.main.feels_like = data.main.feels_like - KELVIN_OFFSET;

    return data;
  } catch (error: any) {
    // Erros de rede (e.g., sem conexão) serão capturados aqui
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão: Verifique sua internet.');
    }
    console.error("Erro no serviço de clima:", error);
    throw error;
  }
};

export const fetchDailyForecastByCity = async (city: string, days: number = 16): Promise<DailyForecast> => {
  try {
    const url = `${OPEN_WEATHER_DAILY_FORECAST_ENDPOINT}?q=${city}&cnt=${days}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cidade não encontrada para previsão. Verifique o nome da cidade.');
      }
      if (response.status === 401) {
        throw new Error('Chave de API inválida para previsão. Verifique sua configuração.');
      }
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor na previsão: ${response.status}`);
      } catch (jsonError) {
        throw new Error(`Erro de rede ou servidor na previsão: ${response.status}`);
      }
    }

    const data: DailyForecast = await response.json();

    data.list.forEach(day => {
      day.temp.day = day.temp.day - KELVIN_OFFSET;
      day.temp.min = day.temp.min - KELVIN_OFFSET;
      day.temp.max = day.temp.max - KELVIN_OFFSET;
      day.temp.night = day.temp.night - KELVIN_OFFSET;
      day.temp.eve = day.temp.eve - KELVIN_OFFSET;
      day.temp.morn = day.temp.morn - KELVIN_OFFSET;
      day.feels_like.day = day.feels_like.day - KELVIN_OFFSET;
      day.feels_like.night = day.feels_like.night - KELVIN_OFFSET;
      day.feels_like.eve = day.feels_like.eve - KELVIN_OFFSET;
      day.feels_like.morn = day.feels_like.morn - KELVIN_OFFSET;
    });

    return data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão na previsão: Verifique sua internet.');
    }
    console.error("Erro no serviço de previsão diária:", error);
    throw error;
  }
};