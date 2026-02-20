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

interface RainfallChartProps {
  data: MonthlyData[];
}

const PRECIP_COLOR = '#1e3a5f';

export function RainfallChart({ data }: RainfallChartProps) {
  const chartData = data.map((d) => ({
    name: d.month.slice(0, 3),
    'Precipitação (mm)': d.precipitation,
    diasChuva: d.daysWithRain,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Precipitação mensal</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" unit=" mm" />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              formatter={(value: number, name: string) => [
                name === 'Precipitação (mm)' ? `${value} mm` : `${value} dias`,
                name === 'Precipitação (mm)' ? 'Precipitação' : 'Dias com chuva',
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Bar
              dataKey="Precipitação (mm)"
              fill={PRECIP_COLOR}
              name="Precipitação"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
