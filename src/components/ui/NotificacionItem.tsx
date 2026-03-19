import { useNavigate } from 'react-router-dom';
import type { Notificacion } from '../../types/notificaciones.types';

const CONFIG_TIPO = {
  revision_vencida:  { icono: '🔴', color: '#FCEBEB', texto: '#A32D2D', label: 'Revisión vencida' },
  revision_proxima:  { icono: '🟡', color: '#FAEEDA', texto: '#854F0B', label: 'Revisión próxima' },
  sin_actividad:     { icono: '🔵', color: '#E6F1FB', texto: '#185FA5', label: 'Sin actividad' },
  cambio_estado:     { icono: '⚪', color: '#F1EFE8', texto: '#5F5E5A', label: 'Cambio de estado' },
};



interface NotificacionItemProps {
  item: Notificacion;
  onMarcarLeida: (id: string) => void;
  onEliminar?: (id: string) => void;
  isDropdown?: boolean;
}

export const NotificacionItem = ({ item, onMarcarLeida, onEliminar, isDropdown = false }: NotificacionItemProps) => {
  const navigate = useNavigate();
  const conf = CONFIG_TIPO[item.tipo];

  const handleNav = () => {
    if (!item.leida) onMarcarLeida(item.id);
    navigate(`/casos/${item.casoId}`);
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl transition-colors border ${
      item.leida 
        ? 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800/50 opacity-70 hover:opacity-100' 
        : `bg-white dark:bg-[#242424] border-gray-200 dark:border-gray-700 shadow-sm border-l-4`
    }`}
    style={!item.leida ? { borderLeftColor: conf.texto } : {}}
    >
      <div className="text-2xl mt-0.5 leading-none shrink-0" title={conf.label}>{conf.icono}</div>
      
      <div className="flex flex-col w-full min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <span className={`font-semibold text-sm truncate ${item.leida ? 'text-gray-600 dark:text-gray-400' : ''}`} style={{ color: !item.leida ? conf.texto : 'inherit' }}>
             {conf.label}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">{item.fechaRelativa}</span>
        </div>
        
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5 truncate">
           <span className="text-primary truncate">{item.casoNumero}</span>
           <span className="text-gray-400">·</span>
           <span className="truncate">{item.beneficiario}</span>
        </div>
        
        <p className={`text-sm m-0 ${item.leida ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
          {item.mensaje}
        </p>

        {!isDropdown && (
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleNav} className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors bg-transparent border-none p-0 cursor-pointer">
              Ver caso &rarr;
            </button>
            <div className="flex gap-4">
              {!item.leida && (
                <button onClick={() => onMarcarLeida(item.id)} className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer">
                  Marcar leída
                </button>
              )}
              {onEliminar && (
                <button onClick={() => { if(window.confirm('¿Eliminar notificación?')) onEliminar(item.id); }} className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none p-0 cursor-pointer" title="Eliminar">
                  🗑 Eliminar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
