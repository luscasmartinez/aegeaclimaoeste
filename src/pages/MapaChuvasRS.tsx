import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Navbar } from '../components/Navbar';
import { CloudRain, Layers, Droplets } from 'lucide-react';

/** Centro do Rio Grande do Sul (lat, lng) */
const RS_CENTER: [number, number] = [-30.0, -53.0];
const DEFAULT_ZOOM = 6;

/** URL base do OpenStreetMap para mapa base */
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Chave da API OpenWeather (Vite) */
const getApiKey = (): string =>
  (import.meta.env.VITE_OPENWEATHER_API_KEY as string)?.trim() || '';

/** Ajusta o tamanho do mapa ao redimensionar a janela (layout responsivo) */
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

/** Legenda de intensidade da camada de precipitação (OpenWeather) */
function LegendaChuva() {
  const items = [
    { cor: 'bg-blue-200 dark:bg-blue-800', label: 'Leve' },
    { cor: 'bg-blue-500 dark:bg-blue-600', label: 'Moderada' },
    { cor: 'bg-blue-800 dark:bg-blue-900', label: 'Forte' },
  ];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 text-sm">
      <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700 dark:text-slate-300">
        <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        Intensidade
      </div>
      <ul className="space-y-2">
        {items.map(({ cor, label }) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded ${cor}`} />
            <span className="text-slate-600 dark:text-slate-400">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Painel de controles: toggle da camada de chuva e opacidade */
function ControlesMapa({
  chuvaAtiva,
  onChuvaChange,
  opacidade,
  onOpacidadeChange,
}: {
  chuvaAtiva: boolean;
  onChuvaChange: (v: boolean) => void;
  opacidade: number;
  onOpacidadeChange: (v: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-4">
      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        Camadas
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={chuvaAtiva}
          onChange={(e) => onChuvaChange(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
        />
        <span className="text-slate-700 dark:text-slate-300">Camada de chuva (precipitação)</span>
      </label>
      {chuvaAtiva && (
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
            Opacidade: {Math.round(opacidade * 100)}%
          </label>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={opacidade}
            onChange={(e) => onOpacidadeChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-blue-100 dark:bg-blue-900 accent-blue-600 dark:accent-blue-400"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Página "Mapa de Chuvas – RS".
 * Mapa Leaflet com base OpenStreetMap e camada opcional de precipitação OpenWeather.
 */
export function MapaChuvasRS() {
  const [chuvaAtiva, setChuvaAtiva] = useState(true);
  const [opacidade, setOpacidade] = useState(0.7);
  const apiKey = getApiKey();

  const urlChuva = useMemo(() => {
    if (!apiKey) return '';
    return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
  }, [apiKey]);

  const semChave = !apiKey;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        <header className="text-center mb-6 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CloudRain className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Mapa de Chuvas – RS
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Precipitação em tempo quase real. Ative/desative a camada e ajuste a opacidade.
          </p>
        </header>

        {semChave && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-sm animate-fade-in-up">
            Configure <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">VITE_OPENWEATHER_API_KEY</code> no
            arquivo <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env</code> para exibir a camada de
            chuva.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          <aside className="flex flex-col gap-4 lg:w-56 shrink-0 order-2 lg:order-1">
            <ControlesMapa
              chuvaAtiva={chuvaAtiva}
              onChuvaChange={setChuvaAtiva}
              opacidade={opacidade}
              onOpacidadeChange={setOpacidade}
            />
            {chuvaAtiva && <LegendaChuva />}
          </aside>

          <main className="flex-1 min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm order-1 lg:order-2">
            <MapContainer
              center={RS_CENTER}
              zoom={DEFAULT_ZOOM}
              className="h-full w-full"
              scrollWheelZoom
            >
              <MapResizeHandler />
              {/* Base: OpenStreetMap */}
              <TileLayer
                attribution={OSM_ATTRIBUTION}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Camada de precipitação OpenWeather (quando ativa e com chave) */}
              {chuvaAtiva && urlChuva && (
                <TileLayer url={urlChuva} opacity={opacidade} />
              )}
            </MapContainer>
          </main>
        </div>
      </div>
    </div>
  );
}
