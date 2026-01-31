/** Cidades do Rio Grande do Sul (RS), Brasil. Usadas para clima e previsão; a API é chamada com cidade,RS,BR ou cidade,BR. */
export const ALLOWED_CITIES = [
  "ALECRIM",
  "ALEGRETE",
  "BOA VISTA DO BURICA",
  "BOSSOROCA",
  "BRAGA",
  "CACEQUI",
  "CAIBATE",
  "CAMPINA DAS MISSOES",
  "CAMPO NOVO",
  "CANDIDO GODOY",
  "CERRO LARGO",
  "CHIAPETTA",
  "CORONEL BICACO",
  "CRISSIUMAL",
  "DOM PEDRITO",
  "GIRUA",
  "GUARANI DAS MISSOES",
  "HORIZONTINA",
  "HUMAITA",
  "ITAQUI",
  "JAGUARI",
  "MANOEL VIANA",
  "MIRAGUAI",
  "PORTO LUCENA",
  "PORTO XAVIER",
  "QUARAI",
  "REDENTORA",
  "ROSARIO DO SUL",
  "SANTA ROSA",
  "SANTIAGO",
  "SANTO ANGELO",
  "SANTO ANTONIO DAS MISSOES",
  "SANTO AUGUSTO",
  "SANTO CRISTO",
  "SAO BORJA",
  "SAO FRANCISCO DE ASSIS",
  "SAO LUIZ GONZAGA",
  "SAO MARTINHO",
  "SAO NICOLAU",
  "SAO VICENTE DO SUL",
  "TENENTE PORTELA",
  "TRES DE MAIO",
  "TRES PASSOS",
  "TUCUNDUVA",
  "TUPARENDI",
  "INDEPENDENCIA",
  "MAURICIO CARDOSO",
  "ENTRE IJUIS",
  "MAçAMBARá",
  "SEDE NOVA",
  "NOVA ESPERANCA DO SUL",
  "VISTA GAUCHA",
  "SAO MIGUEL DAS MISSOES",
  "BARRA DO GUARITA",
  "BARRA DO QUARAI",
  "UNISTALDA",
  "TIRADENTES DO SUL",
  "INHACORá",
  "DERRUBADAS",
  "SAO JOSE DO INHACORA",
  "BOM PROGRESSO"
];

/**
 * Coordenadas fixas para cidades que a API não encontra por nome (404) ou resolve errado (ex.: Braga → Portugal).
 * Chave = nome da cidade em MAIÚSCULAS. Quando existir, a API é chamada por lat/lon em vez de nome.
 * Fonte: IBGE, GeoHack, Wikipedia e prefeituras RS.
 */
export const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  BRAGA: { lat: -27.61585194250343, lon: -53.740134765078224 },
  'BOA VISTA DO BURICA': { lat: -27.668611, lon: -54.11 },
  'CAMPINA DAS MISSOES': { lat: -27.9889, lon: -54.8394 },
  'CANDIDO GODOY': { lat: -27.9514, lon: -54.7519 },
  MIRAGUAI: { lat: -27.497, lon: -53.6891 },
  'SANTO ANTONIO DAS MISSOES': { lat: -28.5108, lon: -55.2278 },
  'SAO MARTINHO': { lat: -27.7111, lon: -54.5206 },
  'MAURICIO CARDOSO': { lat: -27.4333, lon: -54.9667 },
  'NOVA ESPERANCA DO SUL': { lat: -29.4069, lon: -54.8319 },
  'SAO MIGUEL DAS MISSOES': { lat: -27.868, lon: -55.323 },
  'SAO JOSE DO INHACORA': { lat: -27.725, lon: -54.1275 },
};

/** Retorna coordenadas da cidade se estiver em CITY_COORDINATES (nome normalizado em maiúsculas). */
export function getCoordinatesForCity(cityName: string): { lat: number; lon: number } | undefined {
  const key = cityName.trim().toUpperCase();
  return CITY_COORDINATES[key];
}