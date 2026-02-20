import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData } from '../../services/openMeteoService';
import { useTheme } from '../../contexts/ThemeContext';

interface TemperatureChartProps {
  data: MonthlyData[];
}

const TEMP_MAX_COLOR = '#ea580c';
const TEMP_MIN_COLOR = '#2563eb';
const TEMP_MAX_COLOR_DARK = '#fb923c';
const TEMP_MIN_COLOR_DARK = '#60a5fa';

export function TemperatureChart({ data }: TemperatureChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartData = data.map((d) => ({
    name: d.month.slice(0, 3),
    'Temp. máx. média (°C)': d.tempMax,
    'Temp. mín. média (°C)': d.tempMin,
  }));

  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const bgColor = isDark ? '#1e293b' : '#ffffff';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Temperatura média por mês</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: textColor }} stroke={textColor} />
            <YAxis tick={{ fontSize: 12, fill: textColor }} stroke={textColor} unit=" °C" />
            <Tooltip
              contentStyle={{ 
                borderRadius: '12px', 
                border: `1px solid ${gridColor}`,
                backgroundColor: bgColor,
                color: textColor,
              }}
              formatter={(value: number) => [`${value} °C`, undefined]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar
              dataKey="Temp. máx. média (°C)"
              fill={isDark ? TEMP_MAX_COLOR_DARK : TEMP_MAX_COLOR}
              name="Temp. máx. média"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="Temp. mín. média (°C)"
              fill={isDark ? TEMP_MIN_COLOR_DARK : TEMP_MIN_COLOR}
              name="Temp. mín. média"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
