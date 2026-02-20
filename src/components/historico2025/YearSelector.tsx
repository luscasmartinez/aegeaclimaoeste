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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Selecione o ano
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Dados disponíveis de {minYear} até {maxYear}
      </p>
    </div>
  );
}
