import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { CHART_COLORS } from '../../types/charts.types';
import type { DonutChartProps } from '../../types/charts.types';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DonutChart = ({
  data,
  labels,
  colors = [CHART_COLORS.green, CHART_COLORS.amber, CHART_COLORS.blue, CHART_COLORS.gray],
  title,
  subtitle,
  cutout = '70%',
  height = 200
}: DonutChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda nativa
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
  };

  return (
    <div className="flex flex-col h-full w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold m-0 leading-tight">{title}</h3>}
          {subtitle && <p className="text-gray-500 text-xs m-0 leading-tight">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative flex-1 w-full flex items-center justify-center" style={{ minHeight: height }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 relative z-10">
        {labels.map((label: string, index: number) => (
          <div key={label} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
