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
import type { HorizontalBarChartProps } from '../../types/charts.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const HorizontalBarChart = ({
  data,
  labels,
  title,
  subtitle,
  colors,
  height = 200,
}: HorizontalBarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const defaultColors = [CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.amber, CHART_COLORS.red, CHART_COLORS.gray];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || defaultColors,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Este prop lo hace horizontal
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
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? '#374151' : '#f3f4f6' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 10 } },
        border: { display: false }
      },
      y: {
        grid: { display: false },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } },
        border: { display: false }
      },
    },
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        {title && <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold m-0 leading-tight">{title}</h3>}
        {subtitle && <p className="text-gray-500 text-xs m-0 leading-tight">{subtitle}</p>}
      </div>
      
      <div className="relative flex-1 w-full" style={{ minHeight: height }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
