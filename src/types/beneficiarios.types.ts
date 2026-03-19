export interface Beneficiario {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaNacimiento: string;
  grupoFamiliar: string;
  casosActivos: number;
  casosTotales: number;
  ultimaActividad: string;
  profesionalAsignado: string;
}

export interface FiltrosBeneficiarios {
  busqueda: string;
  profesional: string;
  tieneActivos: boolean | null;
}

export const BENEFICIARIOS_MOCK: Beneficiario[] = [
  {
    id: 'B001',
    nombre: 'Ana G. Morales',
    rut: '12.345.678-9',
    telefono: '+56 9 8765 4321',
    email: 'ana.morales@email.com',
    direccion: 'Av. Principal 123, Santiago',
    fechaNacimiento: '15/03/1985',
    grupoFamiliar: '3 hijos (8, 6 y 3 años), convive con pareja',
    casosActivos: 1,
    casosTotales: 3,
    ultimaActividad: '25/10/2023',
    profesionalAsignado: 'Marta Gómez',
  },
  {
    id: 'B002',
    nombre: 'Luis J. Pérez',
    rut: '13.456.789-0',
    telefono: '+56 9 7654 3210',
    email: 'luis.perez@email.com',
    direccion: 'Calle Los Aromos 456, Providencia',
    fechaNacimiento: '22/07/1952',
    grupoFamiliar: 'Vive solo, hijos en otra región',
    casosActivos: 1,
    casosTotales: 1,
    ultimaActividad: '24/10/2023',
    profesionalAsignado: 'Diego Rivas',
  },
  {
    id: 'B003',
    nombre: 'María L. Ruiz',
    rut: '14.567.890-1',
    telefono: '+56 9 6543 2109',
    email: 'maria.ruiz@email.com',
    direccion: 'Pasaje Los Pinos 789, Maipú',
    fechaNacimiento: '08/11/1990',
    grupoFamiliar: '2 hijos (5 y 2 años)',
    casosActivos: 0,
    casosTotales: 2,
    ultimaActividad: '23/10/2023',
    profesionalAsignado: 'Diego Rivas',
  },
  {
    id: 'B004',
    nombre: 'Carlos M. Soto',
    rut: '15.678.901-2',
    telefono: '+56 9 5432 1098',
    email: '',
    direccion: 'Sin domicilio fijo',
    fechaNacimiento: '30/04/1978',
    grupoFamiliar: 'Sin grupo familiar identificado',
    casosActivos: 1,
    casosTotales: 1,
    ultimaActividad: '22/10/2023',
    profesionalAsignado: 'Ana Bravo',
  },
  {
    id: 'B005',
    nombre: 'Rosa P. Vargas',
    rut: '16.789.012-3',
    telefono: '+56 9 4321 0987',
    email: 'rosa.vargas@email.com',
    direccion: 'Villa Los Quillayes 321, La Florida',
    fechaNacimiento: '14/09/1965',
    grupoFamiliar: 'Convive con hijo adulto con discapacidad',
    casosActivos: 1,
    casosTotales: 4,
    ultimaActividad: '21/10/2023',
    profesionalAsignado: 'Marta Gómez',
  },
];
