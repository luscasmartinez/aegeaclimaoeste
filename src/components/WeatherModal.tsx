import { useState } from 'react';
import { X, Calendar, Cloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherModalProps {
  weather: WeatherInfo | null;
  onClose: () => void;
}

export function WeatherModal({ weather, onClose }: WeatherModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!weather) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % weather.imagensUrl.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + weather.imagensUrl.length) % weather.imagensUrl.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Informativo Meteorológico</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-6">
            <Calendar className="w-6 h-6" />
            <span className="text-xl font-semibold">{weather.data}</span>
          </div>

          <div className="mb-6 relative bg-gradient-to-br from-blue-100 dark:from-blue-900 to-blue-200 dark:to-blue-800 rounded-2xl overflow-hidden">
            <img
              src={weather.imagensUrl[currentImageIndex]}
              alt={`Mapa meteorológico ${currentImageIndex + 1} de ${weather.data}`}
              className="w-full rounded-2xl shadow-lg"
            />

            {weather.imagensUrl.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100 text-slate-800 dark:text-slate-200 p-2 rounded-full transition-all shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100 text-slate-800 dark:text-slate-200 p-2 rounded-full transition-all shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black dark:bg-slate-900 bg-opacity-60 dark:bg-opacity-80 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentImageIndex + 1} / {weather.imagensUrl.length}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 mt-2">
                  {weather.imagensUrl.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white dark:bg-blue-400 w-6'
                          : 'bg-white dark:bg-slate-600 bg-opacity-50 dark:bg-opacity-50 w-2 hover:bg-opacity-75 dark:hover:bg-opacity-75'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-300 mb-3">Descrição</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{weather.descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
