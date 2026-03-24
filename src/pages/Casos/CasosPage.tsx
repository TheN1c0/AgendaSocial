import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { Caso, FiltrosCasos, EstadoCaso, PrioridadCaso } from '../../types/casos.types';
import { CasosFiltros } from '../../components/casos/CasosFiltros';
import { CasosToolbar } from '../../components/casos/CasosToolbar';
import { CasosTabla } from '../../components/casos/CasosTabla';
import { casosService } from '../../services/casosService';
import { useDebounce } from '../../hooks/useDebounce';
import { ColumnSelector, type Column } from '../../components/ui/ColumnSelector';

const ITEMS_POR_PAGINA = 10;

const filtrosIniciales: FiltrosCasos = {
  busqueda: '',
  estado: '',
  prioridad: '',
  profesional: '',
  fechaDesde: '',
  fechaHasta: '',
  etiquetaId: '',
};

const COLUMNAS_CASOS: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'beneficiario', label: 'Beneficiario' },
  { id: 'estado', label: 'Estado' },
  { id: 'prioridad', label: 'Prioridad' },
  { id: 'etiquetas', label: 'Etiquetas' },
  { id: 'profesional', label: 'Profesional' },
  { id: 'fechaIngreso', label: 'Ingreso' },
  { id: 'ultimaActividad', label: 'Última actividad' },
  { id: 'acciones', label: 'Acciones' }
];

export const CasosPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filtros, setFiltros] = useState<FiltrosCasos>(() => ({
    ...filtrosIniciales,
    estado: (searchParams.get('estado') as EstadoCaso) || '',
    busqueda: searchParams.get('busqueda') || '',
    profesional: searchParams.get('profesional') || '',
    prioridad: (searchParams.get('prioridad') as PrioridadCaso) || '',
    etiquetaId: searchParams.get('etiquetaId') || '',
  }));

  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');
  const [paginaActual, setPagina] = useState(1);
  const [ordenColumna, setOrden] = useState<keyof Caso | null>(null);
  const [ordenDireccion, setDir] = useState<'asc' | 'desc'>('asc');
  const [seleccionados, setSelec] = useState<string[]>([]);
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMNAS_CASOS.map(c => c.id)
  );
  
  const [casoAEliminar, setCasoAEliminar] = useState<string | null>(null);
  
  const debouncedBusqueda = useDebounce(filtros.busqueda, 400);

  useEffect(() => {
    document.title = 'Casos | Agenda Social';
  }, []);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['casos', { 
      busqueda: debouncedBusqueda, 
      estado: filtros.estado, 
      prioridad: filtros.prioridad, 
      profesional: filtros.profesional, 
      etiquetaId: filtros.etiquetaId,
      paginaActual 
    }],
    queryFn: () => casosService.getCasos({
      busqueda: debouncedBusqueda,
      estado: filtros.estado,
      prioridad: filtros.prioridad,
      profesional: filtros.profesional,
      etiquetaId: filtros.etiquetaId,
      page: paginaActual,
      limit: ITEMS_POR_PAGINA
    })
  });

  const deleteMutation = useMutation({
    mutationFn: casosService.deleteCaso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      setCasoAEliminar(null);
    }
  });

  const handleFiltrosChange = (nuevos: Partial<FiltrosCasos>) => {
    setFiltros(prev => ({ ...prev, ...nuevos }));
    setPagina(1);
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

  const casosAPI = response?.data || [];
  const totalItems = response?.meta?.total || 0;
  const totalPaginas = response?.meta?.totalPages || 1;

  const casosPaginados = useMemo(() => {
    let filtrados = casosAPI.map((c: any) => ({
      ...c,
      beneficiarioId: c.beneficiario?.id,
      beneficiario: c.beneficiario?.nombre || 'Desconocido',
      profesional: c.asignadoA?.nombre || 'Sin asignar',
      fechaIngreso: c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-CL') : '-',
      ultimaActividad: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('es-CL') : '-',
      etiquetas: c.etiquetas?.map((e: any) => e.etiqueta) || [],
    }));

    if (ordenColumna) {
      filtrados.sort((a, b) => {
        let valA = a[ordenColumna];
        let valB = b[ordenColumna];
        if (valA < valB) return ordenDireccion === 'asc' ? -1 : 1;
        if (valA > valB) return ordenDireccion === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtrados;
  }, [casosAPI, ordenColumna, ordenDireccion]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelec(casosPaginados.map(c => c.id));
    } else {
      setSelec([]);
    }
  };

  const handleConfirmDelete = () => {
    if (casoAEliminar) {
      deleteMutation.mutate(casoAEliminar);
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
        columnSelector={
          <ColumnSelector 
            columns={COLUMNAS_CASOS} 
            visibleColumns={visibleColumns} 
            onChange={setVisibleColumns} 
          />
        }
      />

      {/* TABLA / TARJETAS */}
      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Cargando casos...</div>
      ) : isError ? (
        <div className="flex justify-center p-12 text-red-500">Error al cargar listado de casos.</div>
      ) : casosPaginados.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center p-12 text-center mt-4">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 m-0">No se encontraron casos</h3>
          <p className="text-gray-500 text-sm mt-1">Intenta ajustando o limpiando los filtros de búsqueda.</p>
        </div>
      ) : (
        <CasosTabla 
          casos={casosPaginados}
          vista={vista}
          visibleColumns={visibleColumns}
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
      )}

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
             Vas a eliminar el caso permanentemente. Esta acción no se puede deshacer.
           </p>
           <div className="flex gap-3 w-full">
             <Button variant="secondary" className="flex-1" onClick={() => setCasoAEliminar(null)}>Cancelar</Button>
             <Button 
               variant="primary" 
               className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 text-white" 
               onClick={handleConfirmDelete}
               disabled={deleteMutation.isPending}
             >
               {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
             </Button>
           </div>
        </div>
      </Modal>

    </div>
  );
};
