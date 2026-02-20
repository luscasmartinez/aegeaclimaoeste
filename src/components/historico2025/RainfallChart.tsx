import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData } from '../../services/openMeteoService';
import { useTheme } from '../../contexts/ThemeContext';

interface RainfallChartProps {
  data: MonthlyData[];
}

const PRECIP_COLOR = '#1e3a5f';
const PRECIP_COLOR_DARK = '#475569';

export function RainfallChart({ data }: RainfallChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartData = data.map((d) => ({
    name: d.month.slice(0, 3),
    'Precipitação (mm)': d.precipitation,
    diasChuva: d.daysWithRain,
  }));

  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const bgColor = isDark ? '#1e293b' : '#ffffff';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Precipitação mensal</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: textColor }} stroke={textColor} />
            <YAxis tick={{ fontSize: 12, fill: textColor }} stroke={textColor} unit=" mm" />
            <Tooltip
              contentStyle={{ 
                borderRadius: '12px', 
                border: `1px solid ${gridColor}`,
                backgroundColor: bgColor,
                color: textColor,
              }}
              formatter={(value: number, name: string) => [
                name === 'Precipitação (mm)' ? `${value} mm` : `${value} dias`,
                name === 'Precipitação (mm)' ? 'Precipitação' : 'Dias com chuva',
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Bar
              dataKey="Precipitação (mm)"
              fill={isDark ? PRECIP_COLOR_DARK : PRECIP_COLOR}
              name="Precipitação"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
