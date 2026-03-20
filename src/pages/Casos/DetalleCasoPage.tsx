import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { IntervencionItem } from '../../components/casos/IntervencionItem';
import { IntervencionForm } from '../../components/casos/IntervencionForm';
import { CambioEstadoModal } from '../../components/casos/CambioEstadoModal';
import type { EstadoCaso } from '../../types/casos.types';
import { casosService } from '../../services/casosService';
import { intervencionesService } from '../../services/intervencionesService';

export const DetalleCasoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [modalIntervencion, setModalIntervencion] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalEliminarDoc, setModalEliminarDoc] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Detalle Caso #${id} | Agenda Social`;
  }, [id]);

  const { data: caso, isLoading, isError } = useQuery({
    queryKey: ['caso', id],
    queryFn: () => casosService.getCasoById(id!),
    enabled: !!id
  });

  const intervencionMutation = useMutation({
    mutationFn: intervencionesService.createIntervencion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caso', id] });
      setModalIntervencion(false);
    }
  });

  const estadoMutation = useMutation({
    mutationFn: (data: { id: string, estado: EstadoCaso }) => casosService.updateCaso(data.id, { estado: data.estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caso', id] });
      setModalEstado(false);
    }
  });

  const parseDate = () => {
    const today = new Date();
    return {
       fecha: today.toISOString().split('T')[0],
       hora: today.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };
  }

  const handleAddIntervencion = (descripcion: string) => {
    const { fecha } = parseDate();
    intervencionMutation.mutate({
      casoId: id!,
      descripcion,
      fecha,
      tipo: 'seguimiento'
    });
  };

  const handleCambioEstado = (nuevoEstado: EstadoCaso, _motivacion: string) => {
    estadoMutation.mutate({ id: id!, estado: nuevoEstado });
    // Note: The backend already creates an automatic intervention when the state changes.
  };

  const confirmarEliminarDoc = () => {
    // Requires document delete API implemented. 
    setModalEliminarDoc(null);
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Cargando detalles del caso...</div>;
  if (isError || !caso) return <div className="p-12 text-center text-red-500">Error al cargar el caso.</div>;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* Miga de pan */}
      <nav className="text-sm font-medium text-gray-500 mb-2">
        <Link to="/casos" className="hover:text-primary transition-colors">Casos</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">{caso.codigoVisible || caso.id}</span>
      </nav>

      {/* HEADER DEL CASO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">
            {caso.codigoVisible || caso.id.substring(0, 8).toUpperCase()} — {caso.tipo}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge estado={caso.estado}>{caso.estado.replace('_', ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</Badge>
            <Badge prioridad={caso.prioridad as any}>{caso.prioridad.charAt(0).toUpperCase() + caso.prioridad.slice(1)}</Badge>
            {caso.etiquetas?.map((eti: any) => (
              <span key={eti.id} className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: eti.color || '#primary' }}>
                {eti.nombre}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setModalEstado(true)}>Cambiar estado</Button>
          <Button variant="secondary" onClick={() => navigate(`/casos/${id!.replace('#','')}/editar`)}>✏️ Editar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA PRINCIPAL 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card title="Descripción del caso">
            <p className="text-gray-700 dark:text-gray-300 m-0 text-sm leading-relaxed">{caso.descripcion}</p>
          </Card>

          <Card title="Objetivos de intervención">
            <p className="text-gray-700 dark:text-gray-300 m-0 text-sm leading-relaxed">{caso.objetivos || 'Sin objetivos definidos.'}</p>
          </Card>

          <Card title="Historial de intervenciones">
            <div className="flex flex-col gap-4 mt-2">
              <Button variant="secondary" onClick={() => setModalIntervencion(true)} className="self-start mb-2" disabled={intervencionMutation.isPending}>
                {intervencionMutation.isPending ? 'Guardando...' : '+ Agregar intervención'}
              </Button>

              <div className="ml-2 relative">
                {caso.intervenciones?.map((int: any, idx: number) => (
                  <IntervencionItem 
                    key={int.id}
                    autor={{ nombre: int.autor?.nombre || 'Usuario', iniciales: int.autor?.nombre?.substring(0,2).toUpperCase() || 'U' }}
                    descripcion={int.descripcion}
                    fecha={new Date(int.fecha).toLocaleDateString('es-CL')}
                    hora={new Date(int.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                    isLast={idx === (caso.intervenciones?.length || 0) - 1}
                  />
                ))}
                {(!caso.intervenciones || caso.intervenciones.length === 0) && (
                  <p className="text-gray-500 text-sm italic">No hay intervenciones registradas.</p>
                )}
              </div>
            </div>
          </Card>

        </div>

        {/* COLUMNA LATERAL 1/3 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <Card title="Datos del caso">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Tipo:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{caso.tipo}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Fecha ingreso:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(caso.createdAt).toLocaleDateString('es-CL')}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Derivado de:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">Consulta directa</span>
              </div>
            </div>
          </Card>

          {caso.beneficiario && (
            <Card title="Beneficiario">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={caso.beneficiario.nombre} size="lg" className="w-[64px] h-[64px] text-2xl" />
                  <div>
                    <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{caso.beneficiario.nombre}</h3>
                    <span className="text-sm text-gray-500">RUT: {caso.beneficiario.rut}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#242424] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2"><span>📞</span> {caso.beneficiario.telefono || '-'}</div>
                  <div className="flex items-center gap-2"><span>✉️</span> {caso.beneficiario.email || '-'}</div>
                  <div className="flex items-center gap-2"><span>📍</span> {caso.beneficiario.direccion || '-'}</div>
                </div>

                {caso.beneficiario.grupoFamiliar && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo familiar</span>
                    <p className="text-sm border-l-2 border-primary pl-3 mt-1 py-1 text-gray-800 dark:text-gray-200 m-0">
                      {caso.beneficiario.grupoFamiliar}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Link to={`/beneficiarios/${caso.beneficiario.id}`} className="text-sm font-medium text-primary hover:underline flex justify-between">
                    Ver ficha completa <span>→</span>
                  </Link>
                  <Link to={`/casos?beneficiarioId=${caso.beneficiario.id}`} className="text-sm font-medium text-primary hover:underline flex justify-between">
                    Ver todos sus casos <span>→</span>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          <Card title="Documentos adjuntos">
            <div className="flex flex-col gap-0 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 mb-4 bg-white dark:bg-[#1a1a1a]">
               {caso.documentos?.map((doc: any) => (
                 <div key={doc.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-2xl">{doc.mimetype?.includes('pdf') ? '📄' : doc.mimetype?.includes('image') ? '🖼️' : '📎'}</span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.nombreOriginal}</span>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{new Date(doc.createdAt).toLocaleDateString('es-CL')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setModalEliminarDoc(doc.id)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer p-1 text-lg leading-none" title="Eliminar">🗑</button>
                    </div>
                 </div>
               ))}
               {(!caso.documentos || caso.documentos.length === 0) && (
                 <div className="p-4 text-center text-sm text-gray-500">No hay documentos adjuntos.</div>
               )}
            </div>
          </Card>

        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={modalIntervencion} onClose={() => setModalIntervencion(false)} title="Agregar Intervención">
        <IntervencionForm 
          onAdd={handleAddIntervencion} 
          onCancel={() => setModalIntervencion(false)} 
        />
      </Modal>

      <CambioEstadoModal 
        isOpen={modalEstado}
        onClose={() => setModalEstado(false)}
        currentState={caso.estado}
        onSave={handleCambioEstado}
      />

      <Modal isOpen={!!modalEliminarDoc} onClose={() => setModalEliminarDoc(null)} title="Eliminar documento" size="sm">
        <div className="flex flex-col items-center justify-center p-4 text-center">
           <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">¿Eliminar adjunto?</h3>
           <p className="text-sm text-gray-500 mb-6">Esta acción borrará el archivo y no podrás recuperarlo.</p>
           <div className="flex gap-3 w-full">
             <Button variant="secondary" className="flex-1" onClick={() => setModalEliminarDoc(null)}>Cancelar</Button>
             <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 text-white" onClick={confirmarEliminarDoc}>Eliminar</Button>
           </div>
        </div>
      </Modal>

    </div>
  );
};
