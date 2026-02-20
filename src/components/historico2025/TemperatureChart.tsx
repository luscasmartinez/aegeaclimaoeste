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

interface TemperatureChartProps {
  data: MonthlyData[];
}

const TEMP_MAX_COLOR = '#ea580c';
const TEMP_MIN_COLOR = '#2563eb';

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = data.map((d) => ({
    name: d.month.slice(0, 3),
    'Temp. máx. média (°C)': d.tempMax,
    'Temp. mín. média (°C)': d.tempMin,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Temperatura média por mês</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" unit=" °C" />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              formatter={(value: number) => [`${value} °C`, undefined]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="Temp. máx. média (°C)"
              fill={TEMP_MAX_COLOR}
              name="Temp. máx. média"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Temp. mín. média (°C)"
              fill={TEMP_MIN_COLOR}
              name="Temp. mín. média"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
