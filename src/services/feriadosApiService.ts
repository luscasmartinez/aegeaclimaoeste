/**
 * Serviço para a Feriados API (https://www.feriadosapi.com/docs).
 * Feriados nacionais, estaduais (RS) e municipais por código IBGE.
 * 
 * Em desenvolvimento usa proxy do Vite para evitar CORS.
 */

// Em dev: proxy local. Em prod: URL direta da API.
const BASE_URL = import.meta.env.DEV ? '/api-feriados' : 'https://feriadosapi.com/api/v1';

function getApiKey(): string {
  const key = (import.meta.env.VITE_FERIADOS_API_KEY as string)?.trim();
  if (!key) {
    throw new Error('Chave da API Feriados não configurada. Defina VITE_FERIADOS_API_KEY no .env');
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
  };
}

/** Tipos de feriado da API */
export type FeriadoTipo = 'NACIONAL' | 'ESTADUAL' | 'MUNICIPAL' | 'FACULTATIVO';

/** Objeto feriado retornado pela API */
export interface Feriado {
  id: string;
  data: string; // DD/MM/YYYY
  nome: string;
  tipo: FeriadoTipo;
  descricao?: string;
  uf?: string;
  codigo_ibge?: number;
}

/** Resposta feriados por cidade */
export interface FeriadosCidadeResponse {
  cidade: {
    ibge: number;
    nome: string;
    uf: string;
  };
  ano: string;
  feriados: Feriado[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

/**
 * Busca feriados de uma cidade pelo código IBGE.
 * Endpoint: /api/v1/feriados/cidade/{ibge}?ano={ano}
 */
export async function getFeriadosCidade(ibge: string, ano: number): Promise<FeriadosCidadeResponse> {
  const res = await fetch(`${BASE_URL}/feriados/cidade/${ibge}?ano=${ano}`, {
    headers: authHeaders(),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro API Feriados (${res.status}): ${text}`);
  }
  
  return res.json();
}

/**
 * Verifica se a chave da API está configurada.
 */
export function hasApiKey(): boolean {
  return Boolean((import.meta.env.VITE_FERIADOS_API_KEY as string)?.trim());
}

/**
 * Mapeamento das cidades da região para código IBGE (RS).
 * Fonte: IBGE - Instituto Brasileiro de Geografia e Estatística
 */
export const CITY_TO_IBGE: Record<string, string> = {
  // Normalizado em MAIÚSCULAS sem acentos
  'ALECRIM': '4301057',
  'ALEGRETE': '4300406',
  'BOA VISTA DO BURICA': '4302154',
  'BOSSOROCA': '4302501',
  'BRAGA': '4302659',
  'CACEQUI': '4302907',
  'CAIBATE': '4303558',
  'CAMPINA DAS MISSOES': '4303707',
  'CAMPO NOVO': '4304002',
  'CANDIDO GODOY': '4304309',
  'CERRO LARGO': '4304705',
  'CHIAPETTA': '4305439',
  'CORONEL BICACO': '4305900',
  'CRISSIUMAL': '4306007',
  'DERRUBADAS': '4306320',
  'DOM PEDRITO': '4306551',
  'ENTRE IJUIS': '4306924',
  'GIRUA': '4309001',
  'GUARANI DAS MISSOES': '4309506',
  'HORIZONTINA': '4309605',
  'HUMAITA': '4309704',
  'INDEPENDENCIA': '4310405',
  'INHACORA': '4310413',
  'ITAQUI': '4310504',
  'JAGUARI': '4311106',
  'MACAMBARA': '4311718',
  'MANOEL VIANA': '4311759',
  'MAURICIO CARDOSO': '4312617',
  'MIRAGUAI': '4312302',
  'NOVA ESPERANCA DO SUL': '4313409',
  'PORTO LUCENA': '4315008',
  'PORTO XAVIER': '4315107',
  'QUARAI': '4315305',
  'REDENTORA': '4315404',
  'ROSARIO DO SUL': '4316402',
  'SANTA ROSA': '4317202',
  'SANTIAGO': '4317400',
  'SANTO ANGELO': '4317509',
  'SANTO ANTONIO DAS MISSOES': '4317608',
  'SANTO AUGUSTO': '4317806',
  'SANTO CRISTO': '4317905',
  'SAO BORJA': '4318002',
  'SAO FRANCISCO DE ASSIS': '4318101',
  'SAO JOSE DO INHACORA': '4318424',
  'SAO LUIZ GONZAGA': '4319209',
  'SAO MARTINHO': '4319100',
  'SAO MIGUEL DAS MISSOES': '4319150',
  'SAO NICOLAU': '4319704',
  'SAO VICENTE DO SUL': '4319802',
  'SEDE NOVA': '4320230',
  'TENENTE PORTELA': '4321402',
  'TIRADENTES DO SUL': '4321471',
  'TRES DE MAIO': '4321808',
  'TRES PASSOS': '4321907',
  'TUCUNDUVA': '4322103',
  'TUPARENDI': '4322301',
  'UNISTALDA': '4322374',
  'VISTA GAUCHA': '4322525',
  'BARRA DO GUARITA': '4311858',
  'BARRA DO QUARAI': '4301875',
  'BOM PROGRESSO': '4302378',
};

/**
 * Normaliza nome da cidade para busca no mapeamento IBGE.
 */
function normalizeCity(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/Ç/g, 'C')
    .replace(/-/g, ' ');
}

/**
 * Retorna o código IBGE para uma cidade.
 */
export function getIbgeForCity(cityName: string): string | null {
  const key = normalizeCity(cityName);
  return CITY_TO_IBGE[key] ?? null;
}

/**
 * Retorna lista de cidades com seus códigos IBGE.
 */
export function getCitiesWithIbge(): Array<{ name: string; ibge: string }> {
  return Object.entries(CITY_TO_IBGE).map(([name, ibge]) => ({
    name,
    ibge,
  }));
}
