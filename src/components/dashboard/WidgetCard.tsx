
import { Card } from '../ui/Card';
import type { DashboardWidget } from '../../types/dashboard.types';
import { DonutChart, BarChart, LineChart, HorizontalBarChart } from '../charts';

interface WidgetCardProps {
  widget: DashboardWidget;
  onHide: (id: string) => void;
  onConfig: (widget: DashboardWidget) => void;
  onPeriodoChange: (id: string, periodo: 'semana' | 'mes') => void;
}

export const WidgetCard = ({ widget, onHide, onConfig, onPeriodoChange }: WidgetCardProps) => {
  const { type, title, subtitle, config, id } = widget;

  const renderChart = () => {
    switch (type) {
      case 'donut':
        return (
          <DonutChart
            title=""
            subtitle=""
            labels={config.labels || []}
            data={config.data || []}
            colors={config.colors}
          />
        );
      case 'bar':
        return (
          <BarChart
            title=""
            subtitle=""
            labels={config.labels || []}
            datasets={config.datasets || []}
            showToggle
            periodo={config.periodo}
            onPeriodoChange={(p) => onPeriodoChange(id, p)}
          />
        );
      case 'line':
        return (
          <LineChart
            title=""
            subtitle=""
            labels={config.labels || []}
            data={config.data || []}
            color={config.color}
            filled={config.filled}
            showToggle
            periodo={config.periodo}
            onPeriodoChange={(p) => onPeriodoChange(id, p)}
          />
        );
      case 'horizontalBar':
        return (
          <HorizontalBarChart
            title=""
            subtitle=""
            labels={config.labels || []}
            data={config.data || []}
            colors={config.colors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card noPadding className="flex flex-col">
      <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="m-0 text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{title}</h3>
          {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onConfig(widget)}
            className="text-gray-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-1"
            title="Configurar widget"
          >
            ⚙️
          </button>
          <button
            onClick={() => onHide(id)}
            className="text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1 text-lg leading-none"
            title="Ocultar widget"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="p-4 flex-1">
        {renderChart()}
      </div>
    </Card>
  );
};
