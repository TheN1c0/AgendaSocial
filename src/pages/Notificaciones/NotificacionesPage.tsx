import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { NotificacionItem } from '../../components/ui/NotificacionItem';
import type { TipoNotificacion } from '../../types/notificaciones.types';

type FiltroNotif = 'todas' | 'sin_leer' | 'leidas';

const TIPOS = [
  { value: '', label: 'Tipo: Todas' },
  { value: 'revision_vencida', label: 'Revisión vencida' },
  { value: 'revision_proxima', label: 'Revisión próxima' },
  { value: 'sin_actividad', label: 'Sin actividad' },
  { value: 'cambio_estado', label: 'Cambio de estado' },
];

export const NotificacionesPage = () => {
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas, eliminar } = useNotificaciones();
  
  const [filtroEstado, setFiltroEstado] = useState<FiltroNotif>('todas');
  const [filtroTipo, setFiltroTipo] = useState<TipoNotificacion | ''>('');

  useEffect(() => { document.title = 'Notificaciones | Agenda Social'; }, []);

  const filtradas = notificaciones.filter(n => {
    if (filtroEstado === 'sin_leer' && n.leida) return false;
    if (filtroEstado === 'leidas' && !n.leida) return false;
    if (filtroTipo && n.tipo !== filtroTipo) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1000px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">Notificaciones</h1>
          <p className="text-sm font-medium text-primary mt-1 mb-0">
             {noLeidas === 0 ? 'Al día 🥳' : `${noLeidas} notificaciones sin leer`}
          </p>
        </div>
        {noLeidas > 0 && (
          <Button variant="secondary" onClick={marcarTodasLeidas}>
            Marcar todas leídas
          </Button>
        )}
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* TABS PASTILLA */}
        <div className="flex p-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg">
          {(['todas', 'sin_leer', 'leidas'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFiltroEstado(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors border-none cursor-pointer ${
                filtroEstado === tab 
                  ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 shadow-sm' 
                  : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-48">
          <Select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value as TipoNotificacion | '')} 
            options={TIPOS}
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-3">
         {filtradas.length === 0 ? (
           <Card className="p-12 text-center flex flex-col items-center justify-center">
             <span className="text-5xl opacity-50 mb-4">📭</span>
             <h3 className="text-gray-900 dark:text-gray-100 m-0 text-lg">No tienes notificaciones pendientes</h3>
             <span className="text-gray-500 text-sm mt-2">Prueba ajustando los filtros de arriba</span>
           </Card>
         ) : (
           filtradas.map(notif => (
             <NotificacionItem 
               key={notif.id} 
               item={notif} 
               onMarcarLeida={marcarLeida} 
               onEliminar={eliminar} 
             />
           ))
         )}
      </div>

    </div>
  );
};
