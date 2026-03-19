import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CASOS_MOCK } from '../../types/casos.types';
import type { Caso, FiltrosCasos, EstadoCaso, PrioridadCaso } from '../../types/casos.types';
import { CasosFiltros } from '../../components/casos/CasosFiltros';
import { CasosToolbar } from '../../components/casos/CasosToolbar';
import { CasosTabla } from '../../components/casos/CasosTabla';

const ITEMS_POR_PAGINA = 10;

const filtrosIniciales: FiltrosCasos = {
  busqueda: '',
  estado: '',
  prioridad: '',
  profesional: '',
  fechaDesde: '',
  fechaHasta: '',
};

export const CasosPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load initial filters from URL query params
  const [filtros, setFiltros] = useState<FiltrosCasos>(() => ({
    ...filtrosIniciales,
    estado: (searchParams.get('estado') as EstadoCaso) || '',
    busqueda: searchParams.get('busqueda') || '',
    profesional: searchParams.get('profesional') || '',
    prioridad: (searchParams.get('prioridad') as PrioridadCaso) || '',
  }));

  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');
  const [paginaActual, setPagina] = useState(1);
  const [ordenColumna, setOrden] = useState<keyof Caso | null>(null);
  const [ordenDireccion, setDir] = useState<'asc' | 'desc'>('asc');
  const [seleccionados, setSelec] = useState<string[]>([]);
  
  const [casoAEliminar, setCasoAEliminar] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Casos | Agenda Social';
  }, []);

  // Handlers
  const handleFiltrosChange = (nuevos: Partial<FiltrosCasos>) => {
    setFiltros(prev => ({ ...prev, ...nuevos }));
    setPagina(1); // Reset page on filter
  };

  const handleClearFiltros = () => {
    setFiltros(filtrosIniciales);
    setPagina(1);
  };

  const handleOrdenChange = (col: keyof Caso) => {
    if (ordenColumna === col) {
      setDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrden(col);
      setDir('asc');
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelec(prev => [...prev, id]);
    } else {
      setSelec(prev => prev.filter(x => x !== id));
    }
  };

  const procesarCasos = () => {
    let filtrados = [...CASOS_MOCK];

    // 1. Filter
    if (filtros.busqueda) {
      const b = filtros.busqueda.toLowerCase();
      filtrados = filtrados.filter(c => 
        c.beneficiario.toLowerCase().includes(b) || 
        c.id.toLowerCase().includes(b)
      );
    }
    if (filtros.estado) {
      filtrados = filtrados.filter(c => c.estado === filtros.estado);
    }
    if (filtros.prioridad) {
      filtrados = filtrados.filter(c => c.prioridad === filtros.prioridad);
    }
    if (filtros.profesional) {
      filtrados = filtrados.filter(c => c.profesional === filtros.profesional);
    }

    // 2. Sort
    if (ordenColumna) {
      filtrados.sort((a, b) => {
        const valA = a[ordenColumna] as string;
        const valB = b[ordenColumna] as string;
        if (valA < valB) return ordenDireccion === 'asc' ? -1 : 1;
        if (valA > valB) return ordenDireccion === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtrados;
  };

  const casosFiltrados = useMemo(procesarCasos, [filtros, ordenColumna, ordenDireccion]);
  
  // 3. Paginate
  const totalItems = casosFiltrados.length;
  const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA) || 1;
  const casosPaginados = casosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelec(casosPaginados.map(c => c.id));
    } else {
      setSelec([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">Casos</h1>
          <p className="text-sm text-gray-500 mt-1 mb-0">Registro y seguimiento de todos los casos</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/casos/nuevo')}>+ Nuevo caso</Button>
      </div>

      {/* FILTROS */}
      <CasosFiltros 
        filtros={filtros}
        onChange={handleFiltrosChange}
        onClear={handleClearFiltros}
      />

      {/* TOOLBAR */}
      <CasosToolbar 
        totalCasos={totalItems}
        vista={vista}
        onVistaChange={setVista}
      />

      {/* TABLA / TARJETAS */}
      <CasosTabla 
        casos={casosPaginados}
        vista={vista}
        seleccionados={seleccionados}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        ordenColumna={ordenColumna}
        ordenDireccion={ordenDireccion}
        onOrdenChange={handleOrdenChange}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalItems={totalItems}
        onPaginaChange={setPagina}
        onVer={(id) => navigate(`/casos/${id.replace('#','')}`)}
        onEditar={(id) => navigate(`/casos/${id.replace('#','')}/editar`)}
        onEliminar={(id) => setCasoAEliminar(id)}
      />

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!casoAEliminar}
        onClose={() => setCasoAEliminar(null)}
        title="Eliminar Caso"
        size="sm"
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4">
             ⚠️
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">¿Estás seguro?</h3>
           <p className="text-sm text-gray-500 mb-6">
             Vas a eliminar el caso <strong>{casoAEliminar}</strong> permanentemente. Esta acción no se puede deshacer. (Modo MOCK: No se borrará realmente).
           </p>
           <div className="flex gap-3 w-full">
             <Button variant="secondary" className="flex-1" onClick={() => setCasoAEliminar(null)}>Cancelar</Button>
             <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 text-white" onClick={() => setCasoAEliminar(null)}>Sí, eliminar</Button>
           </div>
        </div>
      </Modal>

    </div>
  );
};
