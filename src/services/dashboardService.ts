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
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }
};
