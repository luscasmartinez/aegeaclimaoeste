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
  "SANTO ANTONIO DAS MISSOES" ,
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
  "BOM PROGRESSO",
  "CAXIAS DO SUL",
  "BENTO GONCALVES",
  "CAMPO BOM",
  "TEUTONIA",
  "PORTAO",
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

/** Normaliza nome da cidade para comparação (maiúsculas, sem acentos). */
function normalizeCityName(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ç/g, 'C');
}

/**
 * Macro-regiões do RS. Chave = cidade normalizada, valor = código da macro.
 * GO1 - Alegrete | GO2 - Santo Ângelo | GO3 - Santa Rosa
 */
export const CITY_TO_MACRO_REGION: Record<string, string> = {
  ALEGRETE: 'GO1',
  CACEQUI: 'GO1',
  'DOM PEDRITO': 'GO1',
  ITAQUI: 'GO1',
  'MANOEL VIANA': 'GO1',
  QUARAI: 'GO1',
  'ROSARIO DO SUL': 'GO1',
  'SAO BORJA': 'GO1',
  'SAO VICENTE DO SUL': 'GO1',
  MACAMBARA: 'GO1',
  'BARRA DO QUARAI': 'GO1',
  BOSSOROCA: 'GO2',
  CAIBATE: 'GO2',
  'CAMPINA DAS MISSOES': 'GO2',
  'CANDIDO GODOY': 'GO2',
  'CERRO LARGO': 'GO2',
  'GUARANI DAS MISSOES': 'GO2',
  JAGUARI: 'GO2',
  'PORTO LUCENA': 'GO2',
  'PORTO XAVIER': 'GO2',
  SANTIAGO: 'GO2',
  'SANTO ANGELO': 'GO2',
  'SANTO ANTONIO DAS MISSOES': 'GO2',
  'SAO FRANCISCO DE ASSIS': 'GO2',
  'SAO LUIZ GONZAGA': 'GO2',
  'SAO NICOLAU': 'GO2',
  'ENTRE IJUIS': 'GO2',
  'NOVA ESPERANCA DO SUL': 'GO2',
  'SAO MIGUEL DAS MISSOES': 'GO2',
  ALECRIM: 'GO3',
  'BOA VISTA DO BURICA': 'GO3',
  BRAGA: 'GO3',
  'CAMPO NOVO': 'GO3',
  CHIAPETTA: 'GO3',
  'CORONEL BICACO': 'GO3',
  CRISSIUMAL: 'GO3',
  GIRUA: 'GO3',
  HORIZONTINA: 'GO3',
  HUMAITA: 'GO3',
  MIRAGUAI: 'GO3',
  REDENTORA: 'GO3',
  'SANTA ROSA': 'GO3',
  'SANTO AUGUSTO': 'GO3',
  'SANTO CRISTO': 'GO3',
  'SAO MARTINHO': 'GO3',
  'TENENTE PORTELA': 'GO3',
  'TRES DE MAIO': 'GO3',
  'TRES PASSOS': 'GO3',
  TUCUNDUVA: 'GO3',
  TUPARENDI: 'GO3',
  INDEPENDENCIA: 'GO3',
  'MAURICIO CARDOSO': 'GO3',
  'SEDE NOVA': 'GO3',
  'VISTA GAUCHA': 'GO3',
  'BARRA DO GUARITA': 'GO3',
  'TIRADENTES DO SUL': 'GO3',
  INHACORA: 'GO3',
  DERRUBADAS: 'GO3',
  'SAO JOSE DO INHACORA': 'GO3',
  'BOM PROGRESSO': 'GO3',
  UNISTALDA: 'GO3',
};

/** Opções de filtro por macro-região para o dropdown. */
export const MACRO_REGION_OPTIONS = [
  { value: 'all', label: 'Todas as regiões' },
  { value: 'GO1', label: 'GO1 - Alegrete' },
  { value: 'GO2', label: 'GO2 - Santo Ângelo' },
  { value: 'GO3', label: 'GO3 - Santa Rosa' },
] as const;

/** Retorna o código da macro-região da cidade (GO1, GO2, GO3) ou undefined. */
export function getMacroRegionForCity(cityName: string): string | undefined {
  const key = normalizeCityName(cityName);
  return CITY_TO_MACRO_REGION[key];
}
