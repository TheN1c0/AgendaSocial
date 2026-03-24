import { apiClient } from './apiClient';

export interface Etiqueta {
  id: string;
  nombre: string;
  color: string;
  usada: number;
}

export const etiquetasService = {
  getEtiquetas: async (): Promise<Etiqueta[]> => {
    const response = await apiClient.get('/etiquetas');
    return (response as any).data;
  },

  createEtiqueta: async (data: { nombre: string; color: string }): Promise<Etiqueta> => {
    const response = await apiClient.post('/etiquetas', data);
    return (response as any).data;
  },

  updateEtiqueta: async (id: string, data: { nombre?: string; color?: string }): Promise<Etiqueta> => {
    const response = await apiClient.put(`/etiquetas/${id}`, data);
    return (response as any).data;
  },

  deleteEtiqueta: async (id: string): Promise<void> => {
    await apiClient.delete(`/etiquetas/${id}`);
  }
};
