import { apiClient } from './apiClient';

export interface DashboardStats {
  kpis: { label: string; value: number; sub: string; accent?: boolean }[];
  ultimosCasos: {
    id: string;
    idLabel: string;
    cliente: string;
    estado: string;
    prioridad: string;
    ts: string;
    fecha: string;
    ultima: string;
  }[];
  actividad: {
    usuario: string;
    accion: string;
    caso: string;
    tiempo: string;
  }[];
  widgetsData?: {
    casosPorEstado: { labels: string[], data: number[] };
    cargaProfesional: { labels: string[], data: number[] };
    nuevosVsCerrados: { labels: string[], nuevos: number[], cerrados: number[] };
    evolucionActivos: { labels: string[], data: number[] };
  };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }
};
