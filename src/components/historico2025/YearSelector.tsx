interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}

export function YearSelector({
  value,
  onChange,
  disabled = false,
  minYear = 1940,
  maxYear = 2026,
}: YearSelectorProps) {
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Selecione o ano
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Dados disponíveis de {minYear} até {maxYear}
      </p>
    </div>
  );
}
