export type TipoNotificacion =
  | 'revision_vencida'
  | 'revision_proxima'
  | 'sin_actividad'
  | 'cambio_estado';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  leida: boolean;
  casoId: string;
  casoNumero: string; // '#4512'
  beneficiario: string; // 'Ana G. Morales'
  mensaje: string;
  fecha: string;
  fechaRelativa: string; // 'Hace 2 días', 'En 3 días'
}
