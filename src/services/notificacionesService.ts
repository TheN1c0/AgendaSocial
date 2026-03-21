import { apiClient } from './apiClient';
import type { Notificacion } from '../types/notificaciones.types';

export const notificacionesService = {
  getNotificaciones: async (): Promise<Notificacion[]> => {
    return apiClient.get<Notificacion[]>('/notificaciones');
  },
  
  marcarLeida: async (id: string): Promise<Notificacion> => {
    return apiClient.patch<Notificacion>(`/notificaciones/${id}/leida`, {});
  },

  marcarTodasLeidas: async (): Promise<void> => {
    return apiClient.patch<void>('/notificaciones/todas/leida', {});
  },

  eliminar: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/notificaciones/${id}`);
  }
};
