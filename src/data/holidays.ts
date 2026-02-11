/**
 * Feriados nacionais, estaduais (RS) e municipais.
 * Fontes: legislação federal, governo RS, prefeituras e IBGE.
 * Feriados municipais = aniversário do município (data de emancipação) e outros feriados locais.
 */

export type HolidayType = 'nacional' | 'estadual' | 'municipal';

export interface Holiday {
  date: string; // DD/MM
  title: string;
  type: HolidayType;
  city?: string; // só para municipais
}

/** Calcula a data da Páscoa (algoritmo de Meeus) para obter a Sexta-feira Santa. */
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Retorna Sexta-feira Santa no formato DD/MM para o ano. */
export function getSextaFeiraSanta(year: number): string {
  const easter = getEasterDate(year);
  const sexta = new Date(easter);
  sexta.setDate(sexta.getDate() - 2);
  const d = String(sexta.getDate()).padStart(2, '0');
  const m = String(sexta.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}`;
}

/** Retorna Corpus Christi no formato DD/MM para o ano. */
export function getCorpusChristi(year: number): string {
  const easter = getEasterDate(year);
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(corpusChristi.getDate() + 60);
  const d = String(corpusChristi.getDate()).padStart(2, '0');
  const m = String(corpusChristi.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}`;
}

/** Feriados nacionais (datas fixas). */
export const FERIADOS_NACIONAIS: Omit<Holiday, 'city'>[] = [
  { date: '01/01', title: 'Ano Novo', type: 'nacional' },
  { date: '21/04', title: 'Tiradentes', type: 'nacional' },
  { date: '01/05', title: 'Dia do Trabalho', type: 'nacional' },
  { date: '07/09', title: 'Independência do Brasil', type: 'nacional' },
  { date: '12/10', title: 'N. Sra. Aparecida', type: 'nacional' },
  { date: '02/11', title: 'Finados', type: 'nacional' },
  { date: '15/11', title: 'Proclamação da República', type: 'nacional' },
  { date: '25/12', title: 'Natal', type: 'nacional' },
];

/** Feriados estaduais do Rio Grande do Sul. */
export const FERIADOS_RS: Omit<Holiday, 'city'>[] = [
  { date: '20/09', title: 'Revolução Farroupilha', type: 'estadual' },
  { date: '20/11', title: 'Consciência Negra', type: 'estadual' },
];

/**
 * Feriados municipais por cidade (chave = nome normalizado em maiúsculas, sem acentos).
 * Inclui aniversário do município e outros feriados locais conforme mapeamento.
 */
export const FERIADOS_MUNICIPAIS: Record<string, { date: string; title: string }[]> = {
  // Mapeamento completo dos feriados municipais
  ALEGRETE: [
    { date: '25/10', title: 'Aniversário do Município' },
    { date: '08/12', title: 'Dia da Padroeira' },
  ],
  ALEGRIM: [
    { date: '12/05', title: 'Aniversário do Município' },
    { date: '13/04', title: 'Feriado Municipal' },
    { date: '16/08', title: 'Feriado Municipal' },
  ],
  'BARRA DO GUARITA': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'BARRA DO QUARAI': [
    { date: '28/12', title: 'Aniversário do Município' },
  ],
  'BOA VISTA DO BURICA': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '19/03', title: 'São José' },
    { date: '02/12', title: 'Feriado Municipal' },
  ],
  BOSSOROCA: [
    { date: '12/05', title: 'Aniversário do Município' },
    { date: '15/05', title: 'Feriado Municipal' },
    { date: '16/07', title: 'Feriado Municipal' },
  ],
  BRAGA: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '08/05', title: 'Feriado Municipal' },
    { date: '25/07', title: 'Feriado Municipal' },
    { date: '25/11', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  CACEQUI: [
    { date: '28/12', title: 'Aniversário do Município' },
    { date: '29/06', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  CAIBATE: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '02/02', title: 'Feriado Municipal' },
  ],
  'CAMPINA DAS MISSOES': [
    { date: '29/05', title: 'Aniversário do Município' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'CANDIDO GODOY': [
    { date: '28/02', title: 'Aniversário do Município' },
    { date: '25/07', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'CERRO LARGO': [
    { date: '17/05', title: 'Aniversário do Município' },
  ],
  'DOM PEDRITO': [
    { date: '30/10', title: 'Aniversário do Município' },
    { date: '02/02', title: 'Navegantes' },
    { date: '30/10', title: 'Padroeira' },
  ],
  'DOUTOR MAURICIO CARDOSO': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '25/07', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'ENTRE IJUIS': [
    { date: '15/12', title: 'Aniversário do Município' },
    { date: '13/04', title: 'Feriado Municipal' },
  ],
  INDEPENDENCIA: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '23/08', title: 'Feriado Municipal' },
    { date: '05/09', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
  ],
  ITAQUI: [
    { date: '15/12', title: 'Aniversário do Município' },
    { date: '17/03', title: 'Feriado Municipal' },
    { date: '06/12', title: 'Feriado Municipal' },
  ],
  'MANOEL VIANA': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '02/02', title: 'Feriado Municipal' },
    { date: '20/03', title: 'Feriado Municipal' },
  ],
  MACAMBARA: [
    { date: '28/12', title: 'Aniversário do Município' },
    { date: '01/06', title: 'Feriado Municipal' },
  ],
  'PORTO LUCENA': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '02/02', title: 'Feriado Municipal' },
    { date: '06/08', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
  ],
  'PORTO XAVIER': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '15/05', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
    { date: '03/12', title: 'Feriado Municipal' },
  ],
  QUARAI: [
    { date: '12/10', title: 'Aniversário do Município' },
    { date: '08/04', title: 'Feriado Municipal' },
    { date: '24/06', title: 'Feriado Municipal' },
  ],
  REDENTORA: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '12/04', title: 'Feriado Municipal' },
    { date: '19/04', title: 'Feriado Municipal' },
    { date: '25/07', title: 'Feriado Municipal' },
  ],
  'ROSARIO DO SUL': [
    { date: '19/04', title: 'Aniversário do Município' },
    { date: '19/04', title: 'Feriado Municipal' },
  ],
  'SANTA ROSA': [
    { date: '10/07', title: 'Aniversário do Município' },
    { date: '10/08', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
  ],
  SANTIAGO: [
    { date: '04/05', title: 'Aniversário do Município' },
    { date: '04/01', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'SANTO ANTONIO DAS MISSOES': [
    { date: '29/05', title: 'Aniversário do Município' },
    { date: '13/06', title: 'Dia de Santo Antônio' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'SANTO AUGUSTO': [
    { date: '12/05', title: 'Aniversário do Município' },
    { date: '13/06', title: 'Dia de Santo Antônio' },
  ],
  'SANTO CRISTO': [
    { date: '28/01', title: 'Aniversário do Município' },
    { date: '30/05', title: 'Feriado Municipal' },
    { date: '24/06', title: 'Feriado Municipal' },
  ],
  'SANTO ANGELO': [
    { date: '22/03', title: 'Aniversário do Município' },
    { date: '22/03', title: 'Feriado Municipal' },
  ],
  'SAO BORJA': [
    { date: '10/10', title: 'Aniversário do Município' },
    { date: '18/04', title: 'Sexta-Feira da Paixão' },
    { date: '10/10', title: 'S. F. de Borja' },
    { date: '02/11', title: 'Finados' },
  ],
  'SAO FRANCISCO DE ASSIS': [
    { date: '02/10', title: 'Aniversário do Município' },
    { date: '04/01', title: 'Feriado Municipal' },
  ],
  'SAO LUIZ GONZAGA': [
    { date: '02/02', title: 'Aniversário do Município' },
    { date: '03/06', title: 'Feriado Municipal' },
  ],
  'SAO MARTINHO': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '30/03', title: 'Feriado Municipal' },
    { date: '25/07', title: 'Feriado Municipal' },
    { date: '11/11', title: 'Feriado Municipal' },
  ],
  'SAO MIGUEL DAS MISSOES': [
    { date: '29/05', title: 'Aniversário do Município' },
    { date: '29/04', title: 'Feriado Municipal' },
    { date: '29/09', title: 'Feriado Municipal' },
  ],
  'SAO NICOLAU': [
    { date: '29/05', title: 'Aniversário do Município' },
    { date: '25/04', title: 'Feriado Municipal' },
  ],
  'SAO VICENTE DO SUL': [
    { date: '09/05', title: 'Aniversário do Município' },
    { date: '30/09', title: 'Aniversário do Município' },
    { date: '08/12', title: 'Nossa Sra Conceição' },
  ],
  'TENENTE PORTELA': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '18/08', title: 'Feriado Municipal' },
    { date: '08/12', title: 'Feriado Municipal' },
  ],
  'TRES DE MAIO': [
    { date: '28/05', title: 'Aniversário do Município' },
    { date: '03/05', title: 'Feriado Municipal' },
    { date: '31/10', title: 'Feriado Municipal' },
  ],
  'TRES PASSOS': [
    { date: '28/12', title: 'Aniversário do Município' },
    { date: '25/07', title: 'Feriado Municipal' },
    { date: '28/12', title: 'Feriado Municipal' },
  ],
  TUCUNDUVA: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '20/08', title: 'Feriado Municipal' },
    { date: '10/09', title: 'Feriado Municipal' },
    { date: '21/11', title: 'Feriado Municipal' },
  ],
  TUPARENDI: [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '08/12', title: 'Feriado Municipal' },
    { date: '31/12', title: 'Feriado Municipal' },
  ],
  'GUARANI DAS MISSOES': [
    { date: '29/05', title: 'Aniversário do Município' },
  ],
  JAGUARI: [
    { date: '12/05', title: 'Aniversário do Município' },
  ],
  'CAMPO NOVO': [
    { date: '20/03', title: 'Aniversário do Município' },
    { date: '15/05', title: 'Feriado Municipal' },
    { date: '13/12', title: 'Feriado Municipal' },
  ],
  CHIAPETTA: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'CORONEL BICACO': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  CRISSIUMAL: [
    { date: '28/02', title: 'Aniversário do Município' },
  ],
  GIRUA: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  HORIZONTINA: [
    { date: '18/02', title: 'Aniversário do Município' },
  ],
  HUMAITA: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  MIRAGUAI: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'SEDE NOVA': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'VISTA GAUCHA': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'TIRADENTES DO SUL': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  INHACORA: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  DERRUBADAS: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'SAO JOSE DO INHACORA': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  'BOM PROGRESSO': [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
  UNISTALDA: [
    { date: '20/03', title: 'Aniversário do Município' },
  ],
};

function normalizeCityForHoliday(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ç/g, 'C')
    .replace(/-/g, ' ')
    .replace(/Ã/g, 'A')
    .replace(/Õ/g, 'O')
    .replace(/Ê/g, 'E')
    .replace(/Â/g, 'A')
    .replace(/Á/g, 'A')
    .replace(/É/g, 'E')
    .replace(/Í/g, 'I')
    .replace(/Ó/g, 'O')
    .replace(/Ú/g, 'U');
}

/** Retorna todos os feriados para uma cidade e ano. */
export function getHolidaysForCity(cityName: string, year: number): Holiday[] {
  const list: Holiday[] = [];
  const sextaSanta = getSextaFeiraSanta(year);
  const corpusChristi = getCorpusChristi(year);

  // Adiciona feriados nacionais
  FERIADOS_NACIONAIS.forEach((h) => list.push({ ...h, city: undefined }));
  
  // Adiciona Sexta-feira Santa (feriado nacional móvel)
  list.push({
    date: sextaSanta,
    title: 'Sexta-feira Santa',
    type: 'nacional',
  });

  // Adiciona Corpus Christi (feriado nacional facultativo)
  list.push({
    date: corpusChristi,
    title: 'Corpus Christi',
    type: 'nacional',
  });

  // Adiciona feriados estaduais
  FERIADOS_RS.forEach((h) => list.push({ ...h, city: undefined }));

  // Adiciona feriados municipais
  const key = normalizeCityForHoliday(cityName);
  const municipais = FERIADOS_MUNICIPAIS[key];
  if (municipais) {
    municipais.forEach((m) =>
      list.push({
        date: m.date,
        title: m.title,
        type: 'municipal',
        city: cityName,
      })
    );
  }

  // Remove duplicatas baseadas em data e título
  const seen = new Set<string>();
  const uniqueList = list.filter(holiday => {
    const key = `${holiday.date}-${holiday.title}-${holiday.type}-${holiday.city || ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  // Ordena por data
  return uniqueList.sort((a, b) => {
    const [da, ma] = a.date.split('/').map(Number);
    const [db, mb] = b.date.split('/').map(Number);
    if (ma !== mb) return ma - mb;
    return da - db;
  });
}

/** Verifica se uma data específica é feriado na cidade */
export function isHoliday(cityName: string, date: Date): boolean {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateStr = `${day}/${month}`;
  
  const holidays = getHolidaysForCity(cityName, year);
  return holidays.some(holiday => holiday.date === dateStr);
}

/** Retorna a descrição do feriado para uma data específica */
export function getHolidayDescription(cityName: string, date: Date): string | null {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateStr = `${day}/${month}`;
  
  const holidays = getHolidaysForCity(cityName, year);
  const holiday = holidays.find(h => h.date === dateStr);
  
  return holiday ? `${holiday.title} (${holiday.type}${holiday.city ? ` - ${holiday.city}` : ''})` : null;
}