import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';
import { BENEFICIARIOS_MOCK } from '../../types/beneficiarios.types';
import type { FiltrosBeneficiarios } from '../../types/beneficiarios.types';
import { BeneficiarioCard } from '../../components/beneficiarios/BeneficiarioCard';
import { BeneficiarioFila } from '../../components/beneficiarios/BeneficiarioFila';
import { PROFESIONALES } from '../../types/casos.types'; // Reuse profesions mock

const filtrosIniciales: FiltrosBeneficiarios = {
  busqueda: '',
  profesional: '',
  tieneActivos: null
};

export const BeneficiariosPage = () => {
  const [beneficiarios, setBeneficiarios] = useState(BENEFICIARIOS_MOCK);
  const [filtros, setFiltros] = useState<FiltrosBeneficiarios>(filtrosIniciales);
  const [vista, setVista] = useState<'tabla' | 'grilla'>('tabla');
  const [modalNuevo, setModalNuevo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    document.title = 'Beneficiarios | Agenda Social';
  }, []);

  useEffect(() => {
    setFiltros(prev => ({ ...prev, busqueda: debouncedSearch }));
  }, [debouncedSearch]);

  const beneficiariosFiltrados = useMemo(() => {
    return beneficiarios.filter(b => {
      // Búsqueda
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        if (!b.nombre.toLowerCase().includes(q) && !b.rut.toLowerCase().includes(q)) return false;
      }
      // Profesional
      if (filtros.profesional && b.profesionalAsignado !== filtros.profesional) {
        return false;
      }
      // Casos Activos
      if (filtros.tieneActivos !== null) {
        if (filtros.tieneActivos && b.casosActivos === 0) return false;
        if (!filtros.tieneActivos && b.casosActivos > 0) return false;
      }
      return true;
    });
  }, [beneficiarios, filtros]);

  const handleCreateMock = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(fd.entries());
    
    const newB = {
      id: `B00${beneficiarios.length + 1}`,
      nombre: formValues.nombre as string,
      rut: formValues.rut as string,
      telefono: (formValues.telefono as string) || '',
      email: (formValues.email as string) || '',
      direccion: (formValues.direccion as string) || '',
      fechaNacimiento: (formValues.fechaNacimiento as string) || 'Sin registrar',
      grupoFamiliar: (formValues.grupoFamiliar as string) || 'Sin registrar',
      casosActivos: 0,
      casosTotales: 0,
      ultimaActividad: new Date().toLocaleDateString('es-CL'),
      profesionalAsignado: 'Sin asignar'
    };
    
    setBeneficiarios([newB, ...beneficiarios]);
    setModalNuevo(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">Beneficiarios</h1>
          <p className="text-sm text-gray-500 mt-1 mb-0">Personas registradas en el sistema</p>
        </div>
        <Button variant="primary" onClick={() => setModalNuevo(true)}>+ Nuevo beneficiario</Button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm items-center">
        <div className="flex-1 w-full relative">
          <Input 
             placeholder="🔍 Buscar por nombre o RUT..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select 
            value={filtros.profesional}
            onChange={e => setFiltros({ ...filtros, profesional: e.target.value })}
            options={[{ value: '', label: 'Cualquier Profesional' }, ...PROFESIONALES.map(p => ({ value: p, label: p }))]}
            className="w-full md:w-48"
          />
          <Select 
            value={filtros.tieneActivos === null ? '' : filtros.tieneActivos ? 'true' : 'false'}
            onChange={e => {
              const val = e.target.value;
              setFiltros({ ...filtros, tieneActivos: val === '' ? null : val === 'true' })
            }}
            options={[
              { value: '', label: 'Cualquier estado de casos' },
              { value: 'true', label: 'Con casos activos' },
              { value: 'false', label: 'Sin casos activos' }
            ]}
            className="w-full md:w-56"
          />
          <Button 
            variant="secondary" 
            onClick={() => { setFiltros(filtrosIniciales); setSearchTerm(''); }}
            className="text-gray-500"
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex justify-between items-center py-2 h-10">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Mostrando <span className="font-bold text-gray-900 dark:text-gray-100">{beneficiariosFiltrados.length}</span> beneficiarios
        </div>
        
        <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-lg border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setVista('tabla')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border-none cursor-pointer ${
              vista === 'tabla' 
                ? 'bg-white dark:bg-[#2a2a2a] text-primary shadow-sm' 
                : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            ☰ Tabla
          </button>
          <button
            onClick={() => setVista('grilla')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border-none cursor-pointer ${
              vista === 'grilla' 
                ? 'bg-white dark:bg-[#2a2a2a] text-primary shadow-sm' 
                : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            ☷ Grilla
          </button>
        </div>
      </div>

      {/* RENDER TABLA/GRILLA */}
      {beneficiariosFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center p-12 text-center mt-4">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 m-0">No se encontraron beneficiarios</h3>
          <p className="text-gray-500 text-sm mt-1">Intenta ajustando o limpiando los filtros de búsqueda.</p>
        </div>
      ) : (
        vista === 'tabla' ? (
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Nombre</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">RUT</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Teléfono</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Profesional Asignado</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 text-center">Casos activos</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 text-center">Totales</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Última actividad</th>
                  <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {beneficiariosFiltrados.map(b => <BeneficiarioFila key={b.id} beneficiario={b} />)}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiariosFiltrados.map(b => <BeneficiarioCard key={b.id} beneficiario={b} />)}
          </div>
        )
      )}

      {/* MODAL NUEVO */}
      <Modal isOpen={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Beneficiario">
        <form onSubmit={handleCreateMock} className="flex flex-col gap-4">
          <Input name="nombre" placeholder="Ej: Juan Pérez" label="Nombre completo *" required />
          <Input name="rut" placeholder="Ej: 12.345.678-9" label="RUT *" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="telefono" placeholder="+56 9..." label="Teléfono" />
            <Input name="fechaNacimiento" type="date" label="Fecha de Nacimiento" />
          </div>
          <Input name="email" type="email" placeholder="correo@ejemplo.com" label="Correo Electrónico" />
          <Input name="direccion" placeholder="Calle, número, comuna..." label="Dirección" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grupo Familiar
            </label>
            <textarea
              name="grupoFamiliar"
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white dark:placeholder-gray-500"
              placeholder="Ej: Vive con cónyuge y 2 hijos..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="secondary" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Beneficiario</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
