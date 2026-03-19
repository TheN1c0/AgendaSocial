import { Link } from 'react-router-dom';
import type { Caso } from '../../types/casos.types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface CasosTablaProps {
  casos: Caso[];
  vista: 'tabla' | 'tarjetas';
  
  // Selection
  seleccionados: string[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string, checked: boolean) => void;
  
  // Sorting
  ordenColumna: keyof Caso | null;
  ordenDireccion: 'asc' | 'desc';
  onOrdenChange: (col: keyof Caso) => void;
  
  // Pagination
  paginaActual: number;
  totalPaginas: number;
  totalItems: number;
  onPaginaChange: (pag: number) => void;

  // Actions
  onVer: (id: string) => void;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export const CasosTabla = ({
  casos, vista, seleccionados, onSelectAll, onSelect,
  ordenColumna, ordenDireccion, onOrdenChange,
  paginaActual, totalPaginas, totalItems, onPaginaChange,
  onVer, onEditar, onEliminar
}: CasosTablaProps) => {

  const allSelected = casos.length > 0 && seleccionados.length === casos.length;
  
  const SortArrow = ({ column }: { column: keyof Caso }) => {
    if (ordenColumna !== column) return <span className="text-gray-300 dark:text-gray-600 ml-1">↕</span>;
    return <span className="text-primary ml-1">{ordenDireccion === 'asc' ? '↑' : '↓'}</span>;
  };

  const renderPagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] rounded-b-xl">
      <div className="text-sm text-gray-500">
        Página <span className="font-medium text-gray-700 dark:text-gray-300">{paginaActual}</span> de <span className="font-medium text-gray-700 dark:text-gray-300">{totalPaginas}</span> · <span className="font-medium">{totalItems}</span> casos
      </div>
      <div className="flex gap-1 mt-3 sm:mt-0">
        <button
          disabled={paginaActual === 1}
          onClick={() => onPaginaChange(paginaActual - 1)}
          className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-[#2a2a2a] text-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer"
        >
          ‹
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => onPaginaChange(num)}
            className={`px-3 py-1 border rounded transition-colors cursor-pointer text-sm font-medium ${
              paginaActual === num
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] text-gray-600 hover:bg-gray-50 dark:hover:bg-[#333]'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => onPaginaChange(paginaActual + 1)}
          className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-[#2a2a2a] text-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  );

  if (casos.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center p-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 m-0">No se encontraron casos</h3>
        <p className="text-gray-500 text-sm mt-1">Intenta ajustando o limpiando los filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm bg-white dark:bg-[#1a1a1a] overflow-hidden">
      
      {vista === 'tabla' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap" style={{ tableLayout: 'fixed', minWidth: '900px' }}>
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th style={{ width: '36px' }} className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <input 
                    type="checkbox" 
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded text-primary focus:ring-primary dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </th>
                <th style={{ width: '70px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('id')}>
                  ID <SortArrow column="id" />
                </th>
                <th style={{ width: '160px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('beneficiario')}>
                  Beneficiario <SortArrow column="beneficiario" />
                </th>
                <th style={{ width: '110px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('estado')}>
                  Estado <SortArrow column="estado" />
                </th>
                <th style={{ width: '90px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('prioridad')}>
                  Prioridad <SortArrow column="prioridad" />
                </th>
                <th style={{ width: '140px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('profesional')}>
                  Profesional <SortArrow column="profesional" />
                </th>
                <th style={{ width: '90px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('fechaIngreso')}>
                  Ingreso <SortArrow column="fechaIngreso" />
                </th>
                <th style={{ width: '110px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:text-gray-700" onClick={() => onOrdenChange('ultimaActividad')}>
                  Últ. actividad <SortArrow column="ultimaActividad" />
                </th>
                <th style={{ width: '90px' }} className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {casos.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(c.id)}
                      onChange={(e) => onSelect(c.id, e.target.checked)}
                      className="rounded text-primary focus:ring-primary dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button onClick={() => onVer(c.id)} className="text-primary hover:underline bg-transparent border-none cursor-pointer p-0 font-medium">{c.id}</button>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/beneficiarios/${c.id.replace('#','')}`} className="text-gray-800 dark:text-gray-200 hover:text-primary transition-colors font-medium">
                      {c.beneficiario}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge estado={c.estado}>
                      {c.estado.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge prioridad={c.prioridad}>
                      {c.prioridad.charAt(0).toUpperCase() + c.prioridad.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Avatar name={c.profesional} size="sm" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{c.profesional}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.fechaIngreso}</td>
                  <td className="px-4 py-3 text-gray-500">{c.ultimaActividad}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => onVer(c.id)} className="text-gray-400 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer p-0 text-lg" title="Ver detalle">👁</button>
                      <button onClick={() => onEditar(c.id)} className="text-gray-400 hover:text-amber-500 transition-colors bg-transparent border-none cursor-pointer p-0 text-lg" title="Editar">✏️</button>
                      <button onClick={() => onEliminar(c.id)} className="text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-0 text-lg" title="Eliminar">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-black/20">
          {casos.map(c => (
            <div key={c.id} className="relative bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors flex flex-col gap-3">
               <div className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => onEliminar(c.id)}>🗑</div>
               
               <div className="flex justify-between items-start pr-6">
                 <div>
                   <span className="text-xs text-primary font-bold tracking-wider">{c.id}</span>
                   <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight mt-1">{c.beneficiario}</h3>
                   <span className="text-xs text-gray-500 line-clamp-1">{c.tipo}</span>
                 </div>
               </div>

               <div className="flex gap-2">
                  <Badge estado={c.estado}>
                    {c.estado.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </Badge>
                  <Badge prioridad={c.prioridad}>
                    {c.prioridad.charAt(0).toUpperCase() + c.prioridad.slice(1)}
                  </Badge>
               </div>

               <div className="flex items-center gap-2 mt-1">
                 <Avatar name={c.profesional} size="sm" />
                 <span className="text-sm text-gray-600 dark:text-gray-400">{c.profesional}</span>
               </div>

               <div className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 mt-1 flex justify-between items-center">
                 <span>Última act: {c.ultimaActividad}</span>
                 <button onClick={() => onVer(c.id)} className="text-primary font-medium bg-transparent border-none cursor-pointer hover:underline p-0">
                   Ver caso &rarr;
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {renderPagination()}

    </div>
  );
};
