import { apiClient } from './apiClient';

export interface TipoCaso {
  id: string;
  nombre: string;
  usuarioId: string;
  creadoPorDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const tiposCasoService = {
  getTiposCaso: async (): Promise<TipoCaso[]> => {
    return apiClient.get<TipoCaso[]>('/tipos-caso');
  },

  create: async (data: { nombre: string }): Promise<TipoCaso> => {
    return apiClient.post<TipoCaso>('/tipos-caso', data);
  },

  update: async (id: string, data: { nombre: string }): Promise<TipoCaso> => {
    return apiClient.put<TipoCaso>(`/tipos-caso/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/tipos-caso/${id}`);
  }
};
