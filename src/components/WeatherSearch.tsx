import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ALLOWED_CITIES } from '../config/cities';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCity = e.target.value;
    setCity(inputCity);
    setError(null);

    if (inputCity.trim() !== '') {
      const filteredSuggestions = ALLOWED_CITIES.filter(allowedCity =>
        allowedCity.toLowerCase().includes(inputCity.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (selectedCity: string) => {
    setCity(selectedCity);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (city.trim() === '') {
      setError('Por favor, digite o nome de uma cidade.');
      return;
    }

    const cityUpperCase = city.toUpperCase();
    if (!ALLOWED_CITIES.includes(cityUpperCase)) {
      setError('Cidade não encontrada na lista permitida. Por favor, selecione uma cidade da lista.');
      return;
    }

    setError(null);
    onSearch(cityUpperCase);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="flex flex-col items-center p-4 relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2 w-full relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Digite o nome da cidade"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            value={city}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onFocus={() => {
              if (city.trim() !== '' && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Buscar
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mt-2 shadow-lg max-h-60 overflow-auto top-full">
          {suggestions.map((sug, index) => (
            <li
              key={index}
              className="p-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-slate-800 dark:text-slate-200 transition-colors"
              onMouseDown={() => handleSelectSuggestion(sug)}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
};
