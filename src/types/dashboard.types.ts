import type { BarDataset } from './charts.types';

export type ChartType = 'donut' | 'bar' | 'line' | 'horizontalBar';

export type DataSourceType = 'manual' | 'casos-por-estado' | 'carga-profesional' | 'nuevos-vs-cerrados' | 'evolucion-activos';

export interface DashboardWidget {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  visible: boolean;
  order: number;
  dataSource?: DataSourceType;
  config: {
    // Donut / HorizontalBar
    data?: number[];
    labels?: string[];
    colors?: string[];
    // Bar / Line
    datasets?: BarDataset[];
    periodo?: 'semana' | 'mes';
    // Line
    color?: string;
    filled?: boolean;
  };
}
