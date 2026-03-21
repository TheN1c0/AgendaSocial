export type EstadoCaso = 'abierto' | 'en_proceso' | 'cerrado' | 'derivado';
export type PrioridadCaso = 'alta' | 'media' | 'baja';

export interface Caso {
  id: string;
  codigoVisible?: string;
  beneficiario: string;
  beneficiarioId?: string;
  tipo: string;
  estado: EstadoCaso;
  prioridad: PrioridadCaso;
  proximaRevision?: string;
  revisionNotificada?: boolean;
  creadoPorDemo: boolean;
  profesional: string;
  profesionalInicial?: string;
  fechaIngreso: string;
  ultimaActividad: string;
}

export interface CasoDetalle extends Omit<Caso, 'beneficiario' | 'profesional'> {
  descripcion?: string;
  objetivos?: string;
  createdAt: string;
  updatedAt: string;
  beneficiarioId: string;
  profesionalId: string;
  beneficiario?: {
    id: string;
    nombre: string;
    rut: string;
    telefono: string;
    email: string;
    direccion: string;
    fechaNacimiento?: string;
    grupoFamiliar?: string;
  };
  profesional?: {
    id: string;
    nombre: string;
  };
  etiquetas?: Array<{
    id: string;
    nombre: string;
    color: string;
  }>;
  documentos?: Array<{
    id: string;
    mimetype: string;
    nombreOriginal: string;
    createdAt: string;
  }>;
  intervenciones?: Array<{
    id: string;
    descripcion: string;
    fecha: string;
    autor?: {
      nombre: string;
    }
  }>;
}

export interface FiltrosCasos {
  busqueda: string;
  estado: EstadoCaso | '';
  prioridad: PrioridadCaso | '';
  profesional: string;
  fechaDesde: string;
  fechaHasta: string;
}

export const ESTADOS = ['abierto', 'en_proceso', 'cerrado', 'derivado'];
export const PRIORIDADES = ['alta', 'media', 'baja'];
export const PROFESIONALES = ['Marta Gómez', 'Diego Rivas', 'Ana Bravo', 'Carlos Fuentes'];

export const CASOS_MOCK: Caso[] = [
  { id: '#4512', beneficiario: 'Ana G. Morales', tipo: 'Vulnerabilidad social', estado: 'en_proceso', prioridad: 'alta', creadoPorDemo: false, profesional: 'María L.', profesionalInicial: 'ML', fechaIngreso: '12/10/2023', ultimaActividad: 'Hace 2 horas' },
  { id: '#4511', beneficiario: 'Luis J. Pérez', tipo: 'Apoyo vivienda', estado: 'abierto', prioridad: 'media', creadoPorDemo: false, profesional: 'Diego R.', profesionalInicial: 'DR', fechaIngreso: '10/10/2023', ultimaActividad: 'Ayer' },
  { id: '#4510', beneficiario: 'Familia Soto-Vargas', tipo: 'Mediación familiar', estado: 'cerrado', prioridad: 'baja', creadoPorDemo: false, profesional: 'María L.', profesionalInicial: 'ML', fechaIngreso: '05/10/2023', ultimaActividad: 'Hace 5 días' },
  { id: '#4509', beneficiario: 'Carlos M. Soto', tipo: 'Salud mental', estado: 'derivado', prioridad: 'media', creadoPorDemo: false, profesional: 'Ana V.', profesionalInicial: 'AV', fechaIngreso: '01/10/2023', ultimaActividad: 'Hace 1 semana' },
  { id: '#4508', beneficiario: 'Carmen T. Rojas', tipo: 'Situación de calle', estado: 'en_proceso', prioridad: 'alta', creadoPorDemo: false, profesional: 'Diego R.', profesionalInicial: 'DR', fechaIngreso: '28/09/2023', ultimaActividad: 'Hoy' },
  { id: '#4507', beneficiario: 'Roberto N. Silva', tipo: 'Vulnerabilidad social', estado: 'abierto', prioridad: 'baja', creadoPorDemo: false, profesional: 'María L.', profesionalInicial: 'ML', fechaIngreso: '25/09/2023', ultimaActividad: 'Hace 3 días' },
  { id: '#4506', beneficiario: 'Valentina p. Gómez', tipo: 'Violencia intrafamiliar', estado: 'en_proceso', prioridad: 'media', creadoPorDemo: false, profesional: 'Ana V.', profesionalInicial: 'AV', fechaIngreso: '20/09/2023', ultimaActividad: 'Hace 2 semanas' },
  { id: '#4505', beneficiario: 'Juan M. Castillo', tipo: 'Apoyo vivienda', estado: 'cerrado', prioridad: 'baja', creadoPorDemo: false, profesional: 'Diego R.', profesionalInicial: 'DR', fechaIngreso: '15/09/2023', ultimaActividad: 'Hace 1 mes' },
  // ... more mock data
  { id: '#4498', beneficiario: 'Rosa P. Vargas', tipo: 'Salud mental', estado: 'abierto', prioridad: 'media', creadoPorDemo: false, profesional: 'María L.', profesionalInicial: 'ML', fechaIngreso: '10/09/2023', ultimaActividad: 'Hace 1 mes' },
  { id: '#4497', beneficiario: 'Pedro L. Torres', tipo: 'Situación de calle', estado: 'en_proceso', prioridad: 'alta', creadoPorDemo: false, profesional: 'Ana V.', profesionalInicial: 'AV', fechaIngreso: '05/09/2023', ultimaActividad: 'Hace 1 mes' },
  { id: '#4496', beneficiario: 'Laura m. Flores', tipo: 'Vulnerabilidad social', estado: 'cerrado', prioridad: 'baja', creadoPorDemo: false, profesional: 'Diego R.', profesionalInicial: 'DR', fechaIngreso: '01/09/2023', ultimaActividad: 'Hace 2 meses' },
  { id: '#4495', beneficiario: 'Javier S. Ríos', tipo: 'Mediación familiar', estado: 'abierto', prioridad: 'alta', creadoPorDemo: false, profesional: 'María L.', profesionalInicial: 'ML', fechaIngreso: '28/08/2023', ultimaActividad: 'Hace 2 meses' }
];
