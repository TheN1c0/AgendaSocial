import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { IntervencionItem } from '../../components/casos/IntervencionItem';
import { IntervencionForm } from '../../components/casos/IntervencionForm';
import { CambioEstadoModal } from '../../components/casos/CambioEstadoModal';
import type { EstadoCaso } from '../../types/casos.types';

// Mock Data
const CASO_MOCK = {
  id: '#4512',
  tipo: 'Vulnerabilidad social',
  descripcion: 'Familia en situación de vulnerabilidad habitacional. Tres hijos menores de edad. Ingreso familiar bajo el umbral de pobreza. Requiere intervención urgente en vivienda y alimentación.',
  objetivos: 'Gestionar subsidio habitacional, conectar con red de apoyo alimentario, derivar a programa de empleo.',
  prioridad: 'alta',
  estado: 'en_proceso' as EstadoCaso,
  fechaIngreso: '12/10/2023',
  proximaRevision: '15/11/2023',
  derivadoDesde: 'Hospital San Juan de Dios',
  profesional: { nombre: 'Marta Gómez', iniciales: 'MG' },
  etiquetas: [
    { id: '1', nombre: 'Urgente',  color: '#E24B4A' },
    { id: '2', nombre: 'Familia',  color: '#1D9E75' },
    { id: '3', nombre: 'Vivienda', color: '#378ADD' },
  ],
  beneficiario: {
    id: 'B001',
    nombre: 'Ana G. Morales',
    rut: '12.345.678-9',
    telefono: '+56 9 8765 4321',
    email: 'ana.morales@email.com',
    direccion: 'Av. Principal 123, Santiago',
    fechaNacimiento: '15/03/1985',
    grupoFamiliar: '3 hijos (8, 6 y 3 años), convive con pareja',
  },
  intervenciones: [
    {
      id: 'I003',
      autor: { nombre: 'Diego Rivas', iniciales: 'DR' },
      descripcion: 'Llamada de seguimiento. Beneficiaria indica que ya reunió los documentos solicitados. Se agenda reunión presencial para el 25/10.',
      fecha: '22/10/2023',
      hora: '09:00',
    },
    {
      id: 'I002',
      autor: { nombre: 'Marta Gómez', iniciales: 'MG' },
      descripcion: 'Coordinación con municipio para postulación a subsidio DS49. Se solicitan documentos al beneficiario: liquidaciones, contrato arriendo, certificado de residencia.',
      fecha: '18/10/2023',
      hora: '14:15',
    },
    {
      id: 'I001',
      autor: { nombre: 'Marta Gómez', iniciales: 'MG' },
      descripcion: 'Primera visita domiciliaria. Se constata situación de hacinamiento. Familia colaboradora. Se explican los pasos del proceso de intervención.',
      fecha: '14/10/2023',
      hora: '10:30',
    },
  ],
  documentos: [
    { id: 'D001', nombre: 'Ficha de ingreso.pdf',         tipo: 'pdf',   fecha: '12/10/2023', tamaño: '245 KB' },
    { id: 'D002', nombre: 'Certificado de residencia.pdf', tipo: 'pdf',   fecha: '20/10/2023', tamaño: '128 KB' },
    { id: 'D003', nombre: 'Foto vivienda.jpg',             tipo: 'imagen', fecha: '14/10/2023', tamaño: '1.2 MB' },
  ],
};

export const DetalleCasoPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [caso, setCaso] = useState(CASO_MOCK);
  const [modalIntervencion, setModalIntervencion] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalEliminarDoc, setModalEliminarDoc] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Detalle Caso #${id} | Agenda Social`;
  }, [id]);

  const parseDate = () => {
    const today = new Date();
    return {
       fecha: today.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
       hora: today.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };
  }

  const handleAddIntervencion = (descripcion: string) => {
    const { fecha, hora } = parseDate();
    const nuevaIntervencion = {
      id: `I00${caso.intervenciones.length + 1}`,
      autor: { nombre: 'Admin User', iniciales: 'AD' }, // Mocking logged user
      descripcion,
      fecha,
      hora
    };
    setCaso({
      ...caso,
      intervenciones: [nuevaIntervencion, ...caso.intervenciones]
    });
    setModalIntervencion(false);
  };

  const handleCambioEstado = (nuevoEstado: EstadoCaso, motivacion: string) => {
    const { fecha, hora } = parseDate();
    
    // Create automatic entry in history
    const oldStateFormatted = caso.estado.replace('_', ' ');
    const newStateFormatted = nuevoEstado.replace('_', ' ');
    const desc = `Estado cambiado de '${oldStateFormatted}' a '${newStateFormatted}'.${motivacion ? ` Motivo: ${motivacion}` : ''}`;
    
    const nuevaIntervencion = {
      id: `I00${caso.intervenciones.length + 1}`,
      autor: { nombre: 'Admin User', iniciales: 'AD' },
      descripcion: desc,
      fecha,
      hora
    };

    setCaso({
      ...caso,
      estado: nuevoEstado,
      intervenciones: [nuevaIntervencion, ...caso.intervenciones]
    });
  };

  const confirmarEliminarDoc = () => {
    setCaso({
      ...caso,
      documentos: caso.documentos.filter(d => d.id !== modalEliminarDoc)
    });
    setModalEliminarDoc(null);
  };

  const handleDownload = (nombre: string) => {
    console.log(`Descargando documento: ${nombre}...`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* Miga de pan */}
      <nav className="text-sm font-medium text-gray-500 mb-2">
        <Link to="/casos" className="hover:text-primary transition-colors">Casos</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">{caso.id}</span>
      </nav>

      {/* HEADER DEL CASO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">
            {caso.id} — {caso.tipo}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge estado={caso.estado}>{caso.estado.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}</Badge>
            <Badge prioridad={caso.prioridad as any}>{caso.prioridad.charAt(0).toUpperCase() + caso.prioridad.slice(1)}</Badge>
            {caso.etiquetas.map(eti => (
              <span key={eti.id} className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: eti.color }}>
                {eti.nombre}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setModalEstado(true)}>Cambiar estado</Button>
          <Button variant="secondary" onClick={() => console.log('Edit')}>✏️ Editar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA PRINCIPAL 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card title="Descripción del caso">
            <p className="text-gray-700 dark:text-gray-300 m-0 text-sm leading-relaxed">{caso.descripcion}</p>
          </Card>

          <Card title="Objetivos de intervención">
            <p className="text-gray-700 dark:text-gray-300 m-0 text-sm leading-relaxed">{caso.objetivos}</p>
          </Card>

          <Card title="Historial de intervenciones">
            <div className="flex flex-col gap-4 mt-2">
              <Button variant="secondary" onClick={() => setModalIntervencion(true)} className="self-start mb-2">
                + Agregar intervención
              </Button>

              <div className="ml-2 relative">
                {caso.intervenciones.map((int, idx) => (
                  <IntervencionItem 
                    key={int.id}
                    autor={int.autor}
                    descripcion={int.descripcion}
                    fecha={int.fecha}
                    hora={int.hora}
                    isLast={idx === caso.intervenciones.length - 1}
                  />
                ))}
                {caso.intervenciones.length === 0 && (
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
                <span className="font-medium text-gray-900 dark:text-gray-100">{caso.fechaIngreso}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Próx. revisión:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-500">{caso.proximaRevision}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Derivado de:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{caso.derivadoDesde}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500">Profesional:</span>
                <div className="flex items-center gap-2">
                  <Avatar name={caso.profesional.nombre} size="sm" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{caso.profesional.nombre}</span>
                </div>
              </div>
            </div>
          </Card>

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
                <div className="flex items-center gap-2"><span>📞</span> {caso.beneficiario.telefono}</div>
                <div className="flex items-center gap-2"><span>✉️</span> {caso.beneficiario.email}</div>
                <div className="flex items-center gap-2"><span>📍</span> {caso.beneficiario.direccion}</div>
                <div className="flex items-center gap-2"><span>🎂</span> Nacido el {caso.beneficiario.fechaNacimiento}</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo familiar</span>
                <p className="text-sm border-l-2 border-primary pl-3 mt-1 py-1 text-gray-800 dark:text-gray-200 m-0">
                  {caso.beneficiario.grupoFamiliar}
                </p>
              </div>

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

          <Card title="Documentos adjuntos">
            <div className="flex flex-col gap-0 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 mb-4 bg-white dark:bg-[#1a1a1a]">
               {caso.documentos.map(doc => (
                 <div key={doc.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-2xl">{doc.tipo === 'pdf' ? '📄' : doc.tipo === 'imagen' ? '🖼️' : '📎'}</span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.nombre}</span>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{doc.tamaño}</span>
                          <span>·</span>
                          <span>{doc.fecha}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownload(doc.nombre)} className="text-gray-400 hover:text-blue-500 bg-transparent border-none cursor-pointer p-1 text-lg leading-none" title="Descargar">⬇️</button>
                      <button onClick={() => setModalEliminarDoc(doc.id)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer p-1 text-lg leading-none" title="Eliminar">🗑</button>
                    </div>
                 </div>
               ))}
               {caso.documentos.length === 0 && (
                 <div className="p-4 text-center text-sm text-gray-500">No hay documentos adjuntos.</div>
               )}
            </div>

            <label className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer transition-colors border border-dashed border-primary/30">
              <span>+ Subir documento</span>
              <input 
                 type="file" 
                 className="hidden" 
                 onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     const file = e.target.files[0];
                     const newDoc = {
                       id: `D00${caso.documentos.length + 1}`,
                       nombre: file.name,
                       tipo: file.type.includes('image') ? 'imagen' : file.type.includes('pdf') ? 'pdf' : 'otro',
                       fecha: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                       tamaño: '2MB' // Mocked size
                     };
                     setCaso({ ...caso, documentos: [...caso.documentos, newDoc] });
                   }
                 }} 
              />
            </label>
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
