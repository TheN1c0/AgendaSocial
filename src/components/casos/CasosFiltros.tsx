import { useState, useEffect } from 'react';
import { ESTADOS, PRIORIDADES, PROFESIONALES } from '../../types/casos.types';
import type { FiltrosCasos, EstadoCaso, PrioridadCaso } from '../../types/casos.types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';

interface CasosFiltrosProps {
  filtros: FiltrosCasos;
  onChange: (nuevosFiltros: Partial<FiltrosCasos>) => void;
  onClear: () => void;
}

export const CasosFiltros = ({ filtros, onChange, onClear }: CasosFiltrosProps) => {
  const [localBusqueda, setLocalBusqueda] = useState(filtros.busqueda);
  const debouncedBusqueda = useDebounce(localBusqueda, 300);

  // Sync debounced search up
  useEffect(() => {
    if (debouncedBusqueda !== filtros.busqueda) {
      onChange({ busqueda: debouncedBusqueda });
    }
  }, [debouncedBusqueda, filtros.busqueda, onChange]);

  // Sync prop down if URL changes external state
  useEffect(() => {
    setLocalBusqueda(filtros.busqueda);
  }, [filtros.busqueda]);

  const activeFiltersCount = 
    (filtros.busqueda ? 1 : 0) +
    (filtros.estado ? 1 : 0) +
    (filtros.prioridad ? 1 : 0) +
    (filtros.profesional ? 1 : 0) +
    (filtros.fechaDesde ? 1 : 0) +
    (filtros.fechaHasta ? 1 : 0);

  const getLabel = (type: string, val: string) => {
    if (type === 'estado') {
      return `Estado: ${val.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
    }
    if (type === 'prioridad') {
      return `Prioridad: ${val.charAt(0).toUpperCase() + val.slice(1)}`;
    }
    if (type === 'profesional') return `Prof: ${val}`;
    if (type === 'busqueda') return `Búsqueda: "${val}"`;
    if (type === 'fechaDesde') return `Desde: ${val}`;
    if (type === 'fechaHasta') return `Hasta: ${val}`;
    return val;
  };

  const removeFilter = (key: keyof FiltrosCasos) => {
    onChange({ [key]: '' });
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input 
            placeholder="🔍 Buscar por Beneficiario o ID..." 
            value={localBusqueda}
            onChange={(e) => setLocalBusqueda(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-[2]">
          <Select 
            value={filtros.estado}
            onChange={(e) => onChange({ estado: e.target.value as EstadoCaso })}
            options={[
              { value: '', label: 'Estado' },
              ...ESTADOS.map(e => ({ value: e, label: e.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }))
            ]}
          />
          <Select 
            value={filtros.prioridad}
            onChange={(e) => onChange({ prioridad: e.target.value as PrioridadCaso })}
            options={[
              { value: '', label: 'Prioridad' },
              ...PRIORIDADES.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))
            ]}
          />
          <Select 
            value={filtros.profesional}
            onChange={(e) => onChange({ profesional: e.target.value })}
            options={[
              { value: '', label: 'Profesional' },
              ...PROFESIONALES.map(p => ({ value: p, label: p }))
            ]}
          />
          <Button variant="secondary" onClick={onClear} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            Limpiar Todos
          </Button>
        </div>
      </div>

      {/* Date Filters Row */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Ingreso:</label>
        <div className="flex gap-2 items-center">
          <Input 
            type="date" 
            value={filtros.fechaDesde}
            onChange={(e) => onChange({ fechaDesde: e.target.value })}
            className="w-36 text-sm py-1.5"
          />
          <span className="text-gray-400">-</span>
          <Input 
            type="date" 
            value={filtros.fechaHasta}
            onChange={(e) => onChange({ fechaHasta: e.target.value })}
            className="w-36 text-sm py-1.5"
          />
        </div>
      </div>

      {/* Active Chips Row */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          {Object.entries(filtros).map(([key, value]) => {
            if (!value) return null;
            return (
              <span key={key} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-dark">
                {getLabel(key, value as string)}
                <button 
                  onClick={() => removeFilter(key as keyof FiltrosCasos)}
                  className="ml-1 text-primary-dark/50 hover:text-primary-dark focus:outline-none focus:text-primary-dark bg-transparent border-none cursor-pointer leading-none p-0"
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
