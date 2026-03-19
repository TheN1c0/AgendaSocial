import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { CHART_COLORS } from '../../types/charts.types';
import type { BarChartProps, BarDataset } from '../../types/charts.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

export const BarChart = ({
  datasets,
  labels,
  title,
  subtitle,
  showToggle,
  periodo = 'semana',
  onPeriodoChange,
  height = 200,
}: BarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels,
    datasets: datasets.map((ds: BarDataset, index: number) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color || (index === 0 ? CHART_COLORS.blue : CHART_COLORS.primary),
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8,
    })),
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
           <Bar data={chartData} options={options} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 relative z-10">
        {datasets.map((ds: BarDataset, index: number) => (
          <div key={ds.label} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: ds.color || (index === 0 ? CHART_COLORS.blue : CHART_COLORS.primary) }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
