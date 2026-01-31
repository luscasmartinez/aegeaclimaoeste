export const OPEN_WEATHER_API_KEY = "bf0242c25c47f543e527fae1812ab56d";
export const OPEN_WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

/** Código do país (ISO 3166) – Brasil */
export const OPEN_WEATHER_COUNTRY_CODE = "BR";
/** Código do estado – Rio Grande do Sul (evita cidades homônimas de outros estados/países) */
export const OPEN_WEATHER_STATE_CODE_RS = "RS";

/**
 * Query apenas país: cidade,BR. Usado como fallback quando cidade,RS,BR retorna 404.
 */
export function buildLocationQueryBrazilOnly(cityName: string): string {
  return `${cityName.trim()},${OPEN_WEATHER_COUNTRY_CODE}`;
}

/**
 * Query com estado: cidade,RS,BR. Restringe ao Rio Grande do Sul quando a API aceitar.
 * Caso a API não suporte estado no Brasil e retorne 404, use buildLocationQueryBrazilOnly.
 */
export function buildLocationQuery(cityName: string): string {
  const city = cityName.trim();
  return `${city},${OPEN_WEATHER_STATE_CODE_RS},${OPEN_WEATHER_COUNTRY_CODE}`;
}
