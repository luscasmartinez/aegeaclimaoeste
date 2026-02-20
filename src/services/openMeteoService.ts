const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country: string;
  timezone?: string;
  admin1?: string;
}

export interface CityLocation {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface MonthlyData {
  month: string;
  monthIndex: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  tempMaxAbs: number;
  tempMinAbs: number;
  daysWithRain: number;
}

export interface YearlyStats {
  year: number;
  monthlyData: MonthlyData[];
  hottestMonth: MonthlyData;
  coldestMonth: MonthlyData;
  rainiestMonth: MonthlyData;
  totalPrecipitation: number;
}

/** Busca cidades pelo nome (Open-Meteo Geocoding). */
export async function searchCities(query: string): Promise<CityLocation[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=10&language=pt&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar cidades.');

  const data = await res.json();
  const results: GeocodingResult[] = data.results || [];
  return results.map((r) => ({
    name: r.name,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || 'UTC',
  }));
}

/** Busca dados climáticos históricos diários para um ano específico (Open-Meteo Archive). */
export async function fetchArchiveYear(
  latitude: number,
  longitude: number,
  timezone: string,
  year: number
): Promise<YearlyStats> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: startDate,
    end_date: endDate,
    timezone: timezone || 'auto',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
  });

  const res = await fetch(`${ARCHIVE_URL}?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (err.error && err.reason) throw new Error(err.reason);
    throw new Error(`Erro ao buscar dados históricos (${res.status}).`);
  }

  const data = await res.json();
  const daily = data.daily;
  if (!daily || !Array.isArray(daily.time)) {
    throw new Error('Resposta da API sem dados diários.');
  }

  const times: string[] = daily.time;
  const tempMaxArr: (number | null)[] = daily.temperature_2m_max ?? [];
  const tempMinArr: (number | null)[] = daily.temperature_2m_min ?? [];
  const precipArr: (number | null)[] = daily.precipitation_sum ?? [];

  const byMonth = new Map<number, { max: number[]; min: number[]; precip: number[]; daysWithRain: number }>();

  for (let i = 0; i < times.length; i++) {
    const dateStr = times[i];
    const month = parseInt(dateStr.slice(5, 7), 10) - 1;
    if (!byMonth.has(month)) {
      byMonth.set(month, { max: [], min: [], precip: [], daysWithRain: 0 });
    }
    const row = byMonth.get(month)!;
    const max = tempMaxArr[i] ?? 0;
    const min = tempMinArr[i] ?? 0;
    const precip = precipArr[i] ?? 0;
    row.max.push(max);
    row.min.push(min);
    row.precip.push(precip);
    if (precip > 0) row.daysWithRain += 1;
  }

  const monthlyData: MonthlyData[] = [];
  for (let m = 0; m < 12; m++) {
    const row = byMonth.get(m);
    if (!row || row.max.length === 0) {
      monthlyData.push({
        month: MONTH_NAMES[m],
        monthIndex: m,
        tempMax: 0,
        tempMin: 0,
        precipitation: 0,
        tempMaxAbs: 0,
        tempMinAbs: 0,
        daysWithRain: 0,
      });
      continue;
    }
    const tempMax = row.max.reduce((a, b) => a + b, 0) / row.max.length;
    const tempMin = row.min.reduce((a, b) => a + b, 0) / row.min.length;
    const precipitation = row.precip.reduce((a, b) => a + b, 0);
    monthlyData.push({
      month: MONTH_NAMES[m],
      monthIndex: m,
      tempMax: Math.round(tempMax * 10) / 10,
      tempMin: Math.round(tempMin * 10) / 10,
      precipitation: Math.round(precipitation * 10) / 10,
      tempMaxAbs: Math.max(...row.max),
      tempMinAbs: Math.min(...row.min),
      daysWithRain: row.daysWithRain,
    });
  }

  const withData = monthlyData.filter((d) => d.tempMax !== 0 || d.tempMin !== 0 || d.precipitation !== 0);
  const hottestMonth = withData.length
    ? [...withData].sort((a, b) => b.tempMax - a.tempMax)[0]
    : monthlyData[0];
  const coldestMonth = withData.length
    ? [...withData].sort((a, b) => a.tempMin - b.tempMin)[0]
    : monthlyData[0];
  const rainiestMonth = withData.length
    ? [...withData].sort((a, b) => b.precipitation - a.precipitation)[0]
    : monthlyData[0];
  const totalPrecipitation = monthlyData.reduce((s, d) => s + d.precipitation, 0);

  return {
    year,
    monthlyData,
    hottestMonth,
    coldestMonth,
    rainiestMonth,
    totalPrecipitation: Math.round(totalPrecipitation * 10) / 10,
  };
}

/** Busca dados climáticos históricos diários para 2025 (Open-Meteo Archive). */
export async function fetchArchive2025(
  latitude: number,
  longitude: number,
  timezone: string
): Promise<YearlyStats> {
  return fetchArchiveYear(latitude, longitude, timezone, 2025);
}
