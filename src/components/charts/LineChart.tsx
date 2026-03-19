import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { CHART_COLORS } from '../../types/charts.types';
import type { LineChartProps } from '../../types/charts.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function PeriodoToggle({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  return (
    <div className="flex gap-1 ml-auto">
      {(['semana', 'mes'] as const).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            value === p
              ? 'bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-primary-light'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none'
          }`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}

export const LineChart = ({
  data,
  labels,
  title,
  subtitle,
  color = CHART_COLORS.green,
  filled = true,
  showToggle,
  periodo = 'semana',
  onPeriodoChange,
  height = 200,
}: LineChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Dataset',
        data,
        borderColor: color,
        backgroundColor: filled ? (isDark ? `${color}40` : `${color}20`) : 'transparent',
        borderWidth: 2,
        fill: filled,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: color,
        pointBorderColor: isDark ? '#242424' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#333' : '#fff',
        titleColor: isDark ? '#fff' : '#333',
        bodyColor: isDark ? '#ddd' : '#666',
        borderColor: isDark ? '#555' : '#eee',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } },
      },
      y: {
        grid: { color: isDark ? '#374151' : '#f3f4f6' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 10 } },
        border: { display: false }
      },
    },
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold m-0 leading-tight">{title}</h3>}
          {subtitle && <p className="text-gray-500 text-xs m-0 leading-tight">{subtitle}</p>}
        </div>
        {showToggle && onPeriodoChange && (
          <PeriodoToggle value={periodo} onChange={onPeriodoChange} />
        )}
      </div>
      
      <div className="relative flex-1 w-full" style={{ minHeight: height }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
