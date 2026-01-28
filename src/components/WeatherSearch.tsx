import React, { useState } from 'react';
import { ALLOWED_CITIES } from '../config/cities';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    <div className="flex flex-col items-center p-4 relative">
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Digite o nome da cidade"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buscar
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full max-w-md bg-white border border-gray-300 rounded-md mt-1 shadow-lg top-full">
          {suggestions.map((sug, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelectSuggestion(sug)}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
