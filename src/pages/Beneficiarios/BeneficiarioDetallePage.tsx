import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import type { EstadoCaso } from '../../types/casos.types';
import { beneficiariosService } from '../../services/beneficiariosService';

export const BeneficiarioDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [modalEditar, setModalEditar] = useState(false);

  const { data: beneficiario, isLoading, isError } = useQuery({
    queryKey: ['beneficiario', id],
    queryFn: () => beneficiariosService.getBeneficiarioById(id!),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => beneficiariosService.updateBeneficiario(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiario', id] });
      queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
      setModalEditar(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: beneficiariosService.deleteBeneficiario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
      navigate('/beneficiarios');
    },
    onError: (error: any) => {
      alert(error.message || 'Error al eliminar beneficiario');
    }
  });

  useEffect(() => {
    if (beneficiario) {
      document.title = `${beneficiario.nombre} | Agenda Social`;
    }
  }, [beneficiario]);

  if (isLoading) return <div className="p-12 text-center text-gray-500">Cargando perfil...</div>;
  if (isError || !beneficiario) return <div className="p-12 text-center text-red-500">Error al cargar beneficiario.</div>;

  // Edad aproximada
  const calcularEdad = (fecha?: string) => {
    if (!fecha || fecha === 'Sin registrar') return '?';
    const parts = fecha.includes('-') ? fecha.split('-') : fecha.split('/'); // Support internal API YYYY-MM-DD or DD/MM/YYYY
    let y = 0, m = 0, d = 0;
    if (parts[0].length === 4) { [y, m, d] = parts.map(Number); }
    else { [d, m, y] = parts.map(Number); }

    if (!y) return '?';
    const birth = new Date(y, m - 1, d);
    const now = new Date();
    let ed = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
      ed--;
    }
    return ed;
  };

  const edad = calcularEdad(beneficiario.fechaNacimiento);
  const casos = beneficiario.casos || [];
  const casosActivos = casos.filter((c: any) => c.estado !== 'cerrado' && c.estado !== 'derivado').length;
  const casosTotales = casos.length;

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas enviar a la papelera al beneficiario ${beneficiario.nombre}? Podrá ser recuperado posteriormente si es necesario.`)) {
      deleteMutation.mutate(id!);
    }
  };
  
  // Try to determine the main assigned professional from the most recent active case
  const casoReciente = casos[0];
  const profesionalAsignado = casoReciente?.asignadoA?.nombre || 'Sin asignar';
  const ultimaActividad = beneficiario.updatedAt ? new Date(beneficiario.updatedAt).toLocaleDateString('es-CL') : 'Sin registro';

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(fd.entries());
    
    updateMutation.mutate({
      nombre: formValues.nombre as string,
      rut: formValues.rut as string,
      telefono: (formValues.telefono as string) || '',
      email: (formValues.email as string) || '',
      direccion: (formValues.direccion as string) || '',
      fechaNacimiento: (formValues.fechaNacimiento as string) || undefined,
      grupoFamiliar: (formValues.grupoFamiliar as string) || '',
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* Miga de pan */}
      <nav className="text-sm font-medium text-gray-500 mb-2 mt-2">
        <Link to="/beneficiarios" className="hover:text-primary transition-colors">Beneficiarios</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">{beneficiario.nombre}</span>
      </nav>

      {/* HEADER DEL BENEFICIARIO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10 w-full">
           <Avatar name={beneficiario.nombre} size="lg" className="w-[80px] h-[80px] text-3xl shadow-sm border-4 border-white dark:border-[#1a1a1a]" />
           <div className="flex flex-col gap-1 w-full md:w-auto">
             <div className="flex justify-between md:justify-start items-center md:gap-4 w-full">
               <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">
                 {beneficiario.nombre}
               </h1>
               <Button variant="secondary" className="md:hidden" onClick={() => setModalEditar(true)}>✏️</Button>
             </div>
             <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mt-1">
               <span className="flex items-center gap-1 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                 RUT: {beneficiario.rut}
               </span>
               <span className="flex items-center gap-1">
                 <span className="text-gray-400">Prof:</span> 
                 <span className="font-medium text-gray-800 dark:text-gray-200">{profesionalAsignado}</span>
               </span>
             </div>
           </div>
        </div>
        <div className="hidden md:flex relative z-10 shrink-0">
          <Button variant="secondary" onClick={() => setModalEditar(true)}>✏️ Editar datos</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA PRINCIPAL 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card title="Datos de contacto y personales">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Teléfono</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📞</span>{beneficiario.telefono || 'Sin registrar'}
                </span>
              </div>
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>✉️</span>{beneficiario.email || 'Sin registrar'}
                </span>
              </div>
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-2 sm:col-span-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Dirección</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📍</span>{beneficiario.direccion || 'Sin registrar'}
                </span>
              </div>
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Fecha nacimiento</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>🎂</span>{beneficiario.fechaNacimiento || 'Sin registrar'} <span className="text-gray-500 font-normal">({edad} años)</span>
                </span>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Grupo familiar</span>
              <p className="text-sm bg-gray-50 dark:bg-[#242424] border border-gray-100 dark:border-gray-800 rounded-lg p-3 mt-2 text-gray-800 dark:text-gray-200 mt-0">
                {beneficiario.grupoFamiliar || 'Sin registrar'}
              </p>
            </div>
          </Card>

          <Card title="Casos asociados">
            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden overflow-x-auto mt-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">ID</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Estado</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Prioridad</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Profesional</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Ingreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {casos.map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer group" onClick={() => navigate(`/casos/${c.id}`)}>
                      <td className="px-4 py-3 font-medium text-primary group-hover:underline">
                        {c.codigoVisible || c.id}
                      </td>
                      <td className="px-4 py-3">
                        <Badge estado={c.estado as EstadoCaso}>{c.estado.replace('_', ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge prioridad={c.prioridad as any}>{c.prioridad.charAt(0).toUpperCase() + c.prioridad.slice(1)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={c.asignadoA?.nombre} size="sm" className="w-[20px] h-[20px] text-[9px]" />
                          <span className="text-gray-700 dark:text-gray-300">{c.asignadoA?.nombre || 'Sin asignar'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('es-CL')}</td>
                    </tr>
                  ))}
                  {casos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay casos asociados a esta persona.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* COLUMNA LATERAL 1/3 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <Card title="Resumen">
            <div className="flex flex-col gap-4">
              
              <div className="flex justify-between items-center bg-primary/5 border border-primary/20 p-3 rounded-xl">
                <span className="font-semibold text-primary-dark dark:text-primary-light">Casos activos</span>
                <span className="text-2xl font-black text-primary">{casosActivos}</span>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 dark:bg-[#242424] border border-gray-100 dark:border-gray-800 p-3 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Casos totales</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{casosTotales}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 dark:border-gray-800 pb-2 mt-2">
                <span className="text-gray-500">Última actividad:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{ultimaActividad}</span>
              </div>

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="primary" onClick={() => navigate(`/casos/nuevo?beneficiarioId=${beneficiario.id}`)} className="w-full shadow-sm">
                  + Nuevo caso asociado
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/casos?beneficiario=${beneficiario.id}`)} className="w-full">
                  Ver todos sus casos →
                </Button>
                <Button variant="secondary" onClick={handleDelete} className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800" disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'Enviando a papelera...' : '🗑️ Enviar a papelera'}
                </Button>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* MODAL EDITAR */}
      <Modal isOpen={modalEditar} onClose={() => setModalEditar(false)} title="Editar datos del beneficiario">
        <form onSubmit={handleEditSave} className="flex flex-col gap-4">
          <Input name="nombre" defaultValue={beneficiario.nombre} placeholder="Ej: Juan Pérez" label="Nombre completo *" required />
          <Input name="rut" defaultValue={beneficiario.rut} placeholder="Ej: 12.345.678-9" label="RUT *" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="telefono" defaultValue={beneficiario.telefono} placeholder="+56 9..." label="Teléfono" />
            <Input name="fechaNacimiento" type="date" defaultValue={beneficiario.fechaNacimiento === 'Sin registrar' ? '' : beneficiario.fechaNacimiento} label="Fecha de Nacimiento" />
          </div>
          <Input name="email" defaultValue={beneficiario.email} type="email" placeholder="correo@ejemplo.com" label="Correo Electrónico" />
          <Input name="direccion" defaultValue={beneficiario.direccion} placeholder="Calle, número, comuna..." label="Dirección" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grupo Familiar
            </label>
            <textarea
              name="grupoFamiliar"
              rows={3}
              defaultValue={beneficiario.grupoFamiliar === 'Sin registrar' ? '' : beneficiario.grupoFamiliar}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white dark:placeholder-gray-500"
              placeholder="Ej: Vive con cónyuge y 2 hijos..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="secondary" onClick={() => setModalEditar(false)} disabled={updateMutation.isPending}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
