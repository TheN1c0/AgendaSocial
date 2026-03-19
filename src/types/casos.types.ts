export type EstadoCaso = 'abierto' | 'en_proceso' | 'cerrado' | 'derivado';
export type PrioridadCaso = 'alta' | 'media' | 'baja';

export interface Caso {
  id: string;
  beneficiario: string;
  tipo: string;
  estado: EstadoCaso;
  prioridad: PrioridadCaso;
  profesional: string;
  profesionalInicial: string;
  fechaIngreso: string;
  ultimaActividad: string;
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
  { id:'#4512', beneficiario:'Ana G. Morales',   tipo:'Vulnerabilidad social',   estado:'en_proceso', prioridad:'alta',  profesional:'Marta Gómez',   profesionalInicial:'MG', fechaIngreso:'12/10/2023', ultimaActividad:'25/10/2023' },
  { id:'#4511', beneficiario:'Luis J. Pérez',    tipo:'Adulto mayor en riesgo',  estado:'abierto',    prioridad:'media', profesional:'Diego Rivas',   profesionalInicial:'DR', fechaIngreso:'10/10/2023', ultimaActividad:'24/10/2023' },
  { id:'#4510', beneficiario:'María L. Ruiz',    tipo:'Violencia intrafamiliar', estado:'cerrado',    prioridad:'baja',  profesional:'Diego Rivas',   profesionalInicial:'DR', fechaIngreso:'05/10/2023', ultimaActividad:'23/10/2023' },
  { id:'#4509', beneficiario:'Carlos M. Soto',   tipo:'Situación de calle',      estado:'derivado',   prioridad:'media', profesional:'Ana Bravo',     profesionalInicial:'AB', fechaIngreso:'01/10/2023', ultimaActividad:'22/10/2023' },
  { id:'#4508', beneficiario:'Rosa P. Vargas',   tipo:'Infancia y adolescencia', estado:'en_proceso', prioridad:'alta',  profesional:'Marta Gómez',   profesionalInicial:'MG', fechaIngreso:'28/09/2023', ultimaActividad:'21/10/2023' },
  { id:'#4507', beneficiario:'Jorge A. Fuentes', tipo:'Discapacidad',            estado:'abierto',    prioridad:'baja',  profesional:'Carlos Fuentes', profesionalInicial:'CF', fechaIngreso:'25/09/2023', ultimaActividad:'20/10/2023' },
  { id:'#4506', beneficiario:'Elena R. Torres',  tipo:'Vulnerabilidad social',   estado:'en_proceso', prioridad:'media', profesional:'Ana Bravo',     profesionalInicial:'AB', fechaIngreso:'20/09/2023', ultimaActividad:'19/10/2023' },
  { id:'#4505', beneficiario:'Pedro N. Lagos',   tipo:'Adulto mayor en riesgo',  estado:'cerrado',    prioridad:'baja',  profesional:'Diego Rivas',   profesionalInicial:'DR', fechaIngreso:'15/09/2023', ultimaActividad:'18/10/2023' },
  // Adding a few more to test pagination (> 10 items)
  { id:'#4504', beneficiario:'Camila F. Silva',  tipo:'Vulnerabilidad social',   estado:'abierto',    prioridad:'media', profesional:'Marta Gómez',   profesionalInicial:'MG', fechaIngreso:'10/09/2023', ultimaActividad:'15/10/2023' },
  { id:'#4503', beneficiario:'Juan D. Castro',   tipo:'Discapacidad',            estado:'en_proceso', prioridad:'alta',  profesional:'Carlos Fuentes', profesionalInicial:'CF', fechaIngreso:'05/09/2023', ultimaActividad:'14/10/2023' },
  { id:'#4502', beneficiario:'Sofía M. Reyes',   tipo:'Violencia intrafamiliar', estado:'cerrado',    prioridad:'baja',  profesional:'Ana Bravo',     profesionalInicial:'AB', fechaIngreso:'01/09/2023', ultimaActividad:'10/10/2023' },
  { id:'#4501', beneficiario:'Tomás J. Herrera', tipo:'Situación de calle',      estado:'abierto',    prioridad:'alta',  profesional:'Diego Rivas',   profesionalInicial:'DR', fechaIngreso:'28/08/2023', ultimaActividad:'05/10/2023' },
];
