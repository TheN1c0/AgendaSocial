import { apiClient } from './apiClient';
import type { Caso, FiltrosCasos, CasoDetalle } from '../types/casos.types';

interface CasosResponse {
  data: Caso[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const casosService = {
  getCasos: async (params: Partial<FiltrosCasos> & { page?: number; limit?: number }): Promise<CasosResponse> => {
    const searchParams = new URLSearchParams();
    if (params.busqueda) searchParams.append('q', params.busqueda);
    if (params.estado) searchParams.append('estado', params.estado);
    if (params.prioridad) searchParams.append('prioridad', params.prioridad);
    if (params.profesional) searchParams.append('profesionalId', params.profesional);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));

    return apiClient.get<CasosResponse>(`/casos?${searchParams.toString()}`);
  },

  getCasoById: async (id: string): Promise<CasoDetalle> => {
    return apiClient.get<CasoDetalle>(`/casos/${id}`);
  },

  createCaso: async (data: any): Promise<Caso> => {
    return apiClient.post<Caso>('/casos', data);
  },

  updateCaso: async (id: string, data: any): Promise<Caso> => {
    return apiClient.put<Caso>(`/casos/${id}`, data);
  },

  deleteCaso: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/casos/${id}`);
  }
};
