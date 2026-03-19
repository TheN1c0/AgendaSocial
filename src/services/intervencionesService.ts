import { apiClient } from './apiClient';

export const intervencionesService = {
  getIntervencionesByCaso: async (casoId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/casos/${casoId}/intervenciones`); // This endpoint doesn't exist directly, it comes included in getCasoById
  },

  createIntervencion: async (data: { casoId: string; descripcion: string; tipo: string; fecha: string }): Promise<any> => {
    return apiClient.post<any>('/intervenciones', data);
  }
};
