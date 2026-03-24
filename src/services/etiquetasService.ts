import { apiClient } from './apiClient';

export interface Etiqueta {
  id: string;
  nombre: string;
  color: string;
  usada: number;
}

export const etiquetasService = {
  getEtiquetas: async (): Promise<Etiqueta[]> => {
    const response = await apiClient.get<Etiqueta[]>('/etiquetas');
    return response;
  },

  createEtiqueta: async (data: { nombre: string; color: string }): Promise<Etiqueta> => {
    const response = await apiClient.post<Etiqueta>('/etiquetas', data);
    return response;
  },

  updateEtiqueta: async (id: string, data: { nombre?: string; color?: string }): Promise<Etiqueta> => {
    const response = await apiClient.put<Etiqueta>(`/etiquetas/${id}`, data);
    return response;
  },

  deleteEtiqueta: async (id: string): Promise<void> => {
    await apiClient.delete(`/etiquetas/${id}`);
  }
};
