/**
 * Feriados nacionais, estaduais (RS) e municipais.
 * Fontes: legislação federal, governo RS, prefeituras e IBGE.
 * Feriados municipais = aniversário do município (data de emancipação).
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

/** Feriados nacionais (datas fixas). */
export const FERIADOS_NACIONAIS: Omit<Holiday, 'city'>[] = [
  { date: '01/01', title: 'Confraternização Universal', type: 'nacional' },
  { date: '21/04', title: 'Tiradentes', type: 'nacional' },
  { date: '01/05', title: 'Dia do Trabalhador', type: 'nacional' },
  { date: '07/09', title: 'Independência do Brasil', type: 'nacional' },
  { date: '12/10', title: 'Nossa Senhora Aparecida', type: 'nacional' },
  { date: '02/11', title: 'Finados', type: 'nacional' },
  { date: '15/11', title: 'Proclamação da República', type: 'nacional' },
  { date: '25/12', title: 'Natal', type: 'nacional' },
];

/** Feriados estaduais do Rio Grande do Sul. */
export const FERIADOS_RS: Omit<Holiday, 'city'>[] = [
  { date: '20/09', title: 'Dia do Gaúcho (Revolução Farroupilha)', type: 'estadual' },
];

/**
 * Feriados municipais por cidade (chave = nome normalizado em maiúsculas, sem acentos).
 * Data = aniversário do município (emancipação).
 */
export const FERIADOS_MUNICIPAIS: Record<string, { date: string; title: string }[]> = {
  ALEGRETE: [{ date: '25/10', title: 'Aniversário de Alegrete' }],
  CACEQUI: [{ date: '28/12', title: 'Aniversário de Cacequi' }],
  'DOM PEDRITO': [{ date: '30/10', title: 'Aniversário de Dom Pedrito' }],
  ITAQUI: [{ date: '15/12', title: 'Aniversário de Itaqui' }],
  'MANOEL VIANA': [{ date: '20/03', title: 'Aniversário de Manoel Viana' }],
  QUARAI: [{ date: '12/10', title: 'Aniversário de Quaraí' }],
  'ROSARIO DO SUL': [{ date: '19/04', title: 'Aniversário de Rosário do Sul' }],
  'SAO BORJA': [{ date: '10/10', title: 'Aniversário de São Borja' }],
  'SAO VICENTE DO SUL': [{ date: '09/05', title: 'Aniversário de São Vicente do Sul' }],
  MACAMBARA: [{ date: '28/12', title: 'Aniversário de Maçambará' }],
  'BARRA DO QUARAI': [{ date: '28/12', title: 'Aniversário de Barra do Quaraí' }],
  BOSSOROCA: [{ date: '12/05', title: 'Aniversário de Bossoroca' }],
  CAIBATE: [{ date: '20/03', title: 'Aniversário de Caibaté' }],
  'CAMPINA DAS MISSOES': [{ date: '29/05', title: 'Aniversário de Campina das Missões' }],
  'CANDIDO GODOY': [{ date: '28/02', title: 'Aniversário de Cândido Godói' }],
  'CERRO LARGO': [{ date: '17/05', title: 'Aniversário de Cerro Largo' }],
  'GUARANI DAS MISSOES': [{ date: '29/05', title: 'Aniversário de Guarani das Missões' }],
  JAGUARI: [{ date: '12/05', title: 'Aniversário de Jaguari' }],
  'PORTO LUCENA': [{ date: '20/03', title: 'Aniversário de Porto Lucena' }],
  'PORTO XAVIER': [{ date: '20/03', title: 'Aniversário de Porto Xavier' }],
  SANTIAGO: [{ date: '04/05', title: 'Aniversário de Santiago' }],
  'SANTO ANGELO': [{ date: '22/03', title: 'Aniversário de Santo Ângelo' }],
  'SANTO ANTONIO DAS MISSOES': [{ date: '29/05', title: 'Aniversário de Santo Antônio das Missões' }],
  'SAO FRANCISCO DE ASSIS': [{ date: '02/10', title: 'Aniversário de São Francisco de Assis' }],
  'SAO LUIZ GONZAGA': [{ date: '02/02', title: 'Aniversário de São Luiz Gonzaga' }],
  'SAO NICOLAU': [{ date: '29/05', title: 'Aniversário de São Nicolau' }],
  'ENTRE IJUIS': [{ date: '15/12', title: 'Aniversário de Entre-Ijuís' }],
  'NOVA ESPERANCA DO SUL': [{ date: '20/03', title: 'Aniversário de Nova Esperança do Sul' }],
  'SAO MIGUEL DAS MISSOES': [{ date: '29/05', title: 'Aniversário de São Miguel das Missões' }],
  ALECRIM: [{ date: '12/05', title: 'Aniversário de Alecrim' }],
  'BOA VISTA DO BURICA': [{ date: '20/03', title: 'Aniversário de Boa Vista do Buricá' }],
  BRAGA: [{ date: '20/03', title: 'Aniversário de Braga' }],
  'CAMPO NOVO': [{ date: '20/03', title: 'Aniversário de Campo Novo' }],
  CHIAPETTA: [{ date: '20/03', title: 'Aniversário de Chiapetta' }],
  'CORONEL BICACO': [{ date: '20/03', title: 'Aniversário de Coronel Bicaco' }],
  CRISSIUMAL: [{ date: '28/02', title: 'Aniversário de Crissiumal' }],
  GIRUA: [{ date: '20/03', title: 'Aniversário de Giruá' }],
  HORIZONTINA: [{ date: '18/02', title: 'Aniversário de Horizontina' }],
  HUMAITA: [{ date: '20/03', title: 'Aniversário de Humaitá' }],
  MIRAGUAI: [{ date: '20/03', title: 'Aniversário de Miraguaí' }],
  REDENTORA: [{ date: '20/03', title: 'Aniversário de Redentora' }],
  'SANTA ROSA': [{ date: '10/07', title: 'Aniversário de Santa Rosa' }],
  'SANTO AUGUSTO': [{ date: '12/05', title: 'Aniversário de Santo Augusto' }],
  'SANTO CRISTO': [{ date: '28/01', title: 'Aniversário de Santo Cristo' }],
  'SAO MARTINHO': [{ date: '20/03', title: 'Aniversário de São Martinho' }],
  'TENENTE PORTELA': [{ date: '20/03', title: 'Aniversário de Tenente Portela' }],
  'TRES DE MAIO': [{ date: '28/05', title: 'Aniversário de Três de Maio' }],
  'TRES PASSOS': [{ date: '28/12', title: 'Aniversário de Três Passos' }],
  TUCUNDUVA: [{ date: '20/03', title: 'Aniversário de Tucunduva' }],
  TUPARENDI: [{ date: '20/03', title: 'Aniversário de Tuparendi' }],
  INDEPENDENCIA: [{ date: '20/03', title: 'Aniversário de Independência' }],
  'MAURICIO CARDOSO': [{ date: '20/03', title: 'Aniversário de Doutor Maurício Cardoso' }],
  'SEDE NOVA': [{ date: '20/03', title: 'Aniversário de Sede Nova' }],
  'VISTA GAUCHA': [{ date: '20/03', title: 'Aniversário de Vista Gaúcha' }],
  'BARRA DO GUARITA': [{ date: '20/03', title: 'Aniversário de Barra do Guarita' }],
  'TIRADENTES DO SUL': [{ date: '20/03', title: 'Aniversário de Tiradentes do Sul' }],
  INHACORA: [{ date: '20/03', title: 'Aniversário de Inhacorá' }],
  DERRUBADAS: [{ date: '20/03', title: 'Aniversário de Derrubadas' }],
  'SAO JOSE DO INHACORA': [{ date: '20/03', title: 'Aniversário de São José do Inhacorá' }],
  'BOM PROGRESSO': [{ date: '20/03', title: 'Aniversário de Bom Progresso' }],
  UNISTALDA: [{ date: '20/03', title: 'Aniversário de Unistalda' }],
};

function normalizeCityForHoliday(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ç/g, 'C')
    .replace(/-/g, ' ');
}

/** Retorna todos os feriados para uma cidade e ano. */
export function getHolidaysForCity(cityName: string, year: number): Holiday[] {
  const list: Holiday[] = [];
  const sextaSanta = getSextaFeiraSanta(year);

  FERIADOS_NACIONAIS.forEach((h) => list.push({ ...h, city: undefined }));
  list.push({
    date: sextaSanta,
    title: 'Sexta-feira Santa',
    type: 'nacional',
  });
  FERIADOS_RS.forEach((h) => list.push({ ...h, city: undefined }));

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

  return list.sort((a, b) => {
    const [da, ma] = a.date.split('/').map(Number);
    const [db, mb] = b.date.split('/').map(Number);
    if (ma !== mb) return ma - mb;
    return da - db;
  });
}
