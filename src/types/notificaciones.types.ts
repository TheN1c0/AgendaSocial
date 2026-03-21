export type TipoNotificacion =
  | 'revision_vencida'
  | 'revision_proxima'
  | 'sin_actividad'
  | 'cambio_estado'
  | string;

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  leida: boolean;
  casoId?: string;
  casoNumero?: string;
  mensaje: string;
  createdAt: string;
}
