export interface WeatherInfo {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  /** Chuva (mm) – 1h ou 3h; presente quando há precipitação. */
  rain?: { '1h'?: number; '3h'?: number };
  /** Neve (mm) – 1h ou 3h; presente quando há precipitação. */
  snow?: { '1h'?: number; '3h'?: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
    id: number;
    name: string;
    cod: number;
  }

export interface DailyForecast {
  city: {
    id: number;
    name: string;
    coord: {
      lon: number;
      lat: number;
    };
    country: string;
    population: number;
    timezone: number;
  };
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    speed: number;
    deg: number;
    clouds: number;
    pop: number;
    rain?: number;
    snow?: number;
  }>;
}

/** Item de feriado da API feriados.dev (https://api.feriados.dev) */
export interface FeriadosDevHolidayItem {
  id?: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: 'national' | 'state' | 'municipal';
  state?: string;
  city?: string;
  description?: string;
}

/** Resposta da API feriados.dev (success + data) */
export interface FeriadosDevResponse {
  success: boolean;
  data?: FeriadosDevHolidayItem[];
  message?: string;
  error?: { code?: string; message?: string };
}
