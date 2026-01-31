import {
  OPEN_WEATHER_API_KEY,
  OPEN_WEATHER_API_ENDPOINT,
  buildLocationQuery,
  buildLocationQueryBrazilOnly,
} from '../config/openWeather';
import { getCoordinatesForCity } from '../config/cities';
import { WeatherInfo, DailyForecast } from '../types';

const KELVIN_OFFSET = 273.15;

export const OPEN_WEATHER_DAILY_FORECAST_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast/daily";

/** Requisição de clima por query (nome cidade,RS,BR). */
async function requestWeather(query: string): Promise<WeatherInfo> {
  const url = `${OPEN_WEATHER_API_ENDPOINT}?q=${query}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
  const response = await fetch(url);
  if (!response.ok) return Promise.reject({ status: response.status });
  const data: WeatherInfo = await response.json();
  data.main.temp = data.main.temp - KELVIN_OFFSET;
  data.main.temp_min = data.main.temp_min - KELVIN_OFFSET;
  data.main.temp_max = data.main.temp_max - KELVIN_OFFSET;
  data.main.feels_like = data.main.feels_like - KELVIN_OFFSET;
  return data;
}

/** Requisição de clima por coordenadas (lat/lon). Usado para cidades com local fixa (ex.: Braga, RS). */
async function requestWeatherByCoords(lat: number, lon: number): Promise<WeatherInfo> {
  const url = `${OPEN_WEATHER_API_ENDPOINT}?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
  const response = await fetch(url);
  if (!response.ok) return Promise.reject({ status: response.status });
  const data: WeatherInfo = await response.json();
  data.main.temp = data.main.temp - KELVIN_OFFSET;
  data.main.temp_min = data.main.temp_min - KELVIN_OFFSET;
  data.main.temp_max = data.main.temp_max - KELVIN_OFFSET;
  data.main.feels_like = data.main.feels_like - KELVIN_OFFSET;
  return data;
}

export const fetchWeatherByCity = async (city: string): Promise<WeatherInfo> => {
  try {
    const coords = getCoordinatesForCity(city);
    if (coords) {
      const data = await requestWeatherByCoords(coords.lat, coords.lon);
      data.name = city.trim(); // Garante que o nome exibido seja o da cidade solicitada (ex.: Braga, RS)
      return data;
    }
    let query = encodeURIComponent(buildLocationQuery(city));
    let data = await requestWeather(query).catch(async (err) => {
      if (err?.status === 404) {
        query = encodeURIComponent(buildLocationQueryBrazilOnly(city));
        return requestWeather(query);
      }
      return Promise.reject(err);
    });

    return data;
  } catch (err: any) {
    if (err?.status === 404) {
      throw new Error('Cidade não encontrada no Brasil. Verifique o nome da cidade.');
    }
    if (err?.status === 401) {
      throw new Error('Chave de API inválida. Verifique sua configuração.');
    }
    if (err?.name === 'TypeError' && err?.message === 'Failed to fetch') {
      throw new Error('Erro de conexão: Verifique sua internet.');
    }
    console.error('Erro no serviço de clima:', err);
    throw err;
  }
};

/** Requisição de previsão diária por query (nome). */
async function requestDailyForecast(query: string, days: number): Promise<DailyForecast> {
  const url = `${OPEN_WEATHER_DAILY_FORECAST_ENDPOINT}?q=${query}&cnt=${days}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
  const response = await fetch(url);
  if (!response.ok) return Promise.reject({ status: response.status });
  const data: DailyForecast = await response.json();
  convertDailyForecastTemps(data);
  return data;
}

/** Requisição de previsão diária por coordenadas. */
async function requestDailyForecastByCoords(lat: number, lon: number, days: number): Promise<DailyForecast> {
  const url = `${OPEN_WEATHER_DAILY_FORECAST_ENDPOINT}?lat=${lat}&lon=${lon}&cnt=${days}&appid=${OPEN_WEATHER_API_KEY}&lang=pt_br`;
  const response = await fetch(url);
  if (!response.ok) return Promise.reject({ status: response.status });
  const data: DailyForecast = await response.json();
  convertDailyForecastTemps(data);
  return data;
}

function convertDailyForecastTemps(data: DailyForecast): void {
  data.list.forEach((day) => {
    day.temp.day -= KELVIN_OFFSET;
    day.temp.min -= KELVIN_OFFSET;
    day.temp.max -= KELVIN_OFFSET;
    day.temp.night -= KELVIN_OFFSET;
    day.temp.eve -= KELVIN_OFFSET;
    day.temp.morn -= KELVIN_OFFSET;
    day.feels_like.day -= KELVIN_OFFSET;
    day.feels_like.night -= KELVIN_OFFSET;
    day.feels_like.eve -= KELVIN_OFFSET;
    day.feels_like.morn -= KELVIN_OFFSET;
  });
}

export const fetchDailyForecastByCity = async (city: string, days: number = 16): Promise<DailyForecast> => {
  try {
    const coords = getCoordinatesForCity(city);
    if (coords) {
      const data = await requestDailyForecastByCoords(coords.lat, coords.lon, days);
      data.city.name = city.trim(); // Nome exibido = cidade solicitada (ex.: Braga, RS)
      return data;
    }
    let query = encodeURIComponent(buildLocationQuery(city));
    let data = await requestDailyForecast(query, days).catch(async (err) => {
      if (err?.status === 404) {
        query = encodeURIComponent(buildLocationQueryBrazilOnly(city));
        return requestDailyForecast(query, days);
      }
      return Promise.reject(err);
    });
    return data;
  } catch (err: any) {
    if (err?.status === 404) {
      throw new Error('Cidade não encontrada no Brasil para previsão. Verifique o nome da cidade.');
    }
    if (err?.status === 401) {
      throw new Error('Chave de API inválida para previsão. Verifique sua configuração.');
    }
    if (err?.name === 'TypeError' && err?.message === 'Failed to fetch') {
      throw new Error('Erro de conexão na previsão: Verifique sua internet.');
    }
    console.error('Erro no serviço de previsão diária:', err);
    throw err;
  }
};