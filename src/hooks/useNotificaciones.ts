import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificacionesService } from '../services/notificacionesService';
import type { Notificacion } from '../types/notificaciones.types';

// For legacy UI support
const enrichNotificacion = (n: Notificacion) => {
  const date = n.createdAt ? new Date(n.createdAt) : new Date();
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  return {
    ...n,
    beneficiario: 'N/A', // The backend doesn't currently include beneficiaries on notifications to keep it lightweight.
    fecha: date.toLocaleDateString('es-CL'),
    fechaRelativa: diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`,
  };
};

export function useNotificaciones() {
  const queryClient = useQueryClient();

  const { data: rawNotificaciones = [] } = useQuery({
    queryKey: ['notificaciones'],
    queryFn: notificacionesService.getNotificaciones,
    refetchInterval: 60000 // Poll every minute
  });

  const notificaciones = rawNotificaciones.map(enrichNotificacion);
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const leidaMutation = useMutation({
    mutationFn: notificacionesService.marcarLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    }
  });

  const todasLeidasMutation = useMutation({
    mutationFn: notificacionesService.marcarTodasLeidas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    }
  });

  const eliminarMutation = useMutation({
    mutationFn: notificacionesService.eliminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    }
  });

  const marcarLeida = (id: string) => leidaMutation.mutate(id);
  const marcarTodasLeidas = () => todasLeidasMutation.mutate();
  const eliminar = (id: string) => eliminarMutation.mutate(id);

  return { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas, eliminar };
}
