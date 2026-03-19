import { useState, useEffect } from 'react';
import type { Notificacion } from '../types/notificaciones.types';

const NOTIFICACIONES_MOCK: Notificacion[] = [
  {
    id: 'N001',
    tipo: 'revision_vencida',
    leida: false,
    casoId: '4512',
    casoNumero: '#4512',
    beneficiario: 'Ana G. Morales',
    mensaje: 'La revisión programada para el 15/10/2023 está vencida',
    fecha: '15/10/2023',
    fechaRelativa: 'Hace 10 días',
  },
  {
    id: 'N002',
    tipo: 'revision_proxima',
    leida: false,
    casoId: '4511',
    casoNumero: '#4511',
    beneficiario: 'Luis J. Pérez',
    mensaje: 'Tiene una revisión programada para el 28/10/2023',
    fecha: '28/10/2023',
    fechaRelativa: 'En 2 días',
  },
  {
    id: 'N003',
    tipo: 'sin_actividad',
    leida: false,
    casoId: '4509',
    casoNumero: '#4509',
    beneficiario: 'Carlos M. Soto',
    mensaje: 'Este caso no tiene actividad hace 18 días',
    fecha: '08/10/2023',
    fechaRelativa: 'Hace 18 días',
  },
  {
    id: 'N004',
    tipo: 'cambio_estado',
    leida: true,
    casoId: '4510',
    casoNumero: '#4510',
    beneficiario: 'María L. Ruiz',
    mensaje: 'Diego Rivas cambió el estado de "En proceso" a "Cerrado"',
    fecha: '23/10/2023',
    fechaRelativa: 'Hace 2 días',
  },
  {
    id: 'N005',
    tipo: 'revision_proxima',
    leida: true,
    casoId: '4508',
    casoNumero: '#4508',
    beneficiario: 'Rosa P. Vargas',
    mensaje: 'Tiene una revisión programada para el 30/10/2023',
    fecha: '30/10/2023',
    fechaRelativa: 'En 4 días',
  },
];

// Simple global state for the mock so TopBar and View share parity without a formal Provider
let globalMockState = [...NOTIFICACIONES_MOCK];
const listeners = new Set<() => void>();

const updateGlobal = (newState: Notificacion[] | ((prev: Notificacion[]) => Notificacion[])) => {
  globalMockState = typeof newState === 'function' ? newState(globalMockState) : newState;
  listeners.forEach(l => l());
};

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState(globalMockState);

  useEffect(() => {
    const l = () => setNotificaciones(globalMockState);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcarLeida = (id: string) => {
    updateGlobal(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const marcarTodasLeidas = () => {
    updateGlobal(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const eliminar = (id: string) => {
    updateGlobal(prev => prev.filter(n => n.id !== id));
  };

  return { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas, eliminar };
}
