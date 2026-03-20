import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Toast } from '../../components/ui/Toast';
import { BeneficiarioBuscador } from '../../components/beneficiarios/BeneficiarioBuscador';
import { userService } from '../../services/userService';
import { useAuthContext } from '../../context/AuthContext';
import type { PrioridadCaso, EstadoCaso } from '../../types/casos.types';
import { casosService } from '../../services/casosService';

const TIPOS_DE_CASO = [
  'Vulnerabilidad social',
  'Violencia intrafamiliar',
  'Situación de calle',
  'Adulto mayor en riesgo',
  'Infancia y adolescencia',
  'Discapacidad',
  'Otro'
];

interface Etiqueta {
  id: string;
  nombre: string;
  color: string;
}

export const EditarCasoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const isDemo = user?.tipo === 'demo';

  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: userService.getUsers,
    enabled: !isDemo
  });

  const { data: caso, isLoading: isCasoLoading } = useQuery({
    queryKey: ['caso', id],
    queryFn: () => casosService.getCasoById(id!),
    enabled: !!id
  });

  const profesionalesOptions = (usuarios as any[] || [])
    .filter(u => u.rol === 'trabajador_social' || u.rol === 'admin')
    .map(u => ({ value: u.id, label: u.nombre }));

  // Core Form State
  const [beneficiarioId, setBeneficiarioId] = useState<string | null>(null);
  const [tipo, setTipo] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [profesionalId, setProfesionalId] = useState('');
  const [derivadoDesde, setDerivadoDesde] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivos, setObjetivos] = useState('');

  // Extended state
  const [prioridad, setPrioridad] = useState<PrioridadCaso>('media');
  const [estado, setEstado] = useState<EstadoCaso>('abierto');
  const [proximaRevision, setProximaRevision] = useState('');
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  // UI state
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');

  // Load existing caso data into state
  useEffect(() => {
    if (caso) {
      setBeneficiarioId(caso.beneficiario?.id || null);
      setTipo(caso.tipo || '');
      setFechaIngreso(caso.createdAt ? new Date(caso.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setProfesionalId(caso.profesionalId || (caso as any).asignadoA?.id || '');
      setDescripcion(caso.descripcion || '');
      setObjetivos(caso.objetivos || '');
      setPrioridad((caso.prioridad as PrioridadCaso) || 'media');
      setEstado((caso.estado as EstadoCaso) || 'abierto');
      
      if (caso.etiquetas) {
        setEtiquetas(caso.etiquetas.map((e: any) => ({
          id: e.etiqueta.id,
          nombre: e.etiqueta.nombre,
          color: e.etiqueta.color || '#C97A8A'
        })));
      }
    }
  }, [caso]);

  useEffect(() => {
    document.title = 'Editar Caso | Agenda Social';
  }, []);

  const showNotification = (msg: string, type: 'success'|'error') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!beneficiarioId) newErrors.beneficiarioId = 'Debes seleccionar un beneficiario';
    if (!tipo) newErrors.tipo = 'Selecciona el tipo de caso';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!isDemo && !profesionalId) newErrors.profesionalId = 'Asigna un profesional a cargo';
    if (!fechaIngreso) newErrors.fechaIngreso = 'La fecha de ingreso es obligatoria';

    setErrores(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const { mutateAsync: updateCaso, isPending } = useMutation({
    mutationFn: (data: any) => casosService.updateCaso(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      queryClient.invalidateQueries({ queryKey: ['caso', id] });
      showNotification('Caso actualizado exitosamente', 'success');
      setTimeout(() => {
        navigate(`/casos/${id!.replace('#','')}`);
      }, 1000);
    },
    onError: (err: any) => {
      showNotification(err.message || 'Error al actualizar el caso', 'error');
    }
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    
    await updateCaso({
      beneficiarioId: beneficiarioId!,
      tipo,
      descripcion,
      objetivos,
      prioridad,
      estado,
      profesionalId: isDemo ? user!.id : profesionalId,
      // Pass the etiqueta UUIDs to link/unlink
      etiquetas: etiquetas.filter(e => e.id.length > 10).map(e => e.id) // simplistic check assuming real tags have proper UUIDs while temporary ones don't
    });
  };



  const removeEtiqueta = (id: string) => {
    setEtiquetas(etiquetas.filter(e => e.id !== id));
  };

  if (isCasoLoading) return <div className="p-12 text-center text-gray-500">Cargando datos del caso...</div>;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1200px] mx-auto pb-24">
      {showToast && (
        <Toast mensaje={toastMessage} tipo={toastType} onClose={() => setShowToast(false)} />
      )}

      {/* Breadcrumb */}
      <nav className="text-sm font-medium text-gray-500 mb-2 mt-2">
        <span onClick={() => navigate('/casos')} className="hover:text-primary transition-colors cursor-pointer">Casos</span>
        <span className="mx-2">›</span>
        <span onClick={() => navigate(`/casos/${id!.replace('#','')}`)} className="hover:text-primary transition-colors cursor-pointer">{caso?.codigoVisible || id}</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">Editar</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col gap-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">Editar caso {caso?.codigoVisible || id}</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">Modifique los datos correspondientes al caso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA PRINCIPAL 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card title="Beneficiario">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar beneficiario *</label>
              <BeneficiarioBuscador 
                 onSelect={(b) => setBeneficiarioId(b ? b.id : null)} 
                 initialId={caso?.beneficiario?.id}
              />
              {errores.beneficiarioId && <p className="text-red-500 text-xs m-0 mt-1">{errores.beneficiarioId}</p>}
            </div>
          </Card>

          <Card title="Datos del caso">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de caso *</label>
                  <Select 
                    value={tipo} 
                    onChange={e => setTipo(e.target.value)}
                    options={[{value:'', label:'Selecciona...'}, ...TIPOS_DE_CASO.map(t => ({value:t, label:t}))]}
                  />
                  {errores.tipo && <p className="text-red-500 text-xs m-0 mt-1">{errores.tipo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de ingreso *</label>
                  <Input type="date" value={fechaIngreso} disabled />
                  {/* Fecha de ingreso no se suele cambiar una vez creado, disabled por seguridad */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profesional a cargo *</label>
                  <Select 
                    value={isDemo ? user?.id || '' : profesionalId} 
                    onChange={e => setProfesionalId(e.target.value)}
                    options={isDemo ? [{value: user?.id || '', label: `${user?.nombre || 'Usuario'} (Tú)`}] : [{value:'', label:'Selecciona...'}, ...profesionalesOptions]}
                    disabled={isDemo}
                  />
                  {errores.profesionalId && <p className="text-red-500 text-xs m-0 mt-1">{errores.profesionalId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Derivado desde (Op.)</label>
                  <Input placeholder="Ej: Hospital Clínico" value={derivadoDesde} onChange={e => setDerivadoDesde(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción de la situación inicial *</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white"
                  placeholder="Detalla la situación del beneficiario al momento de ingresar..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                />
                {errores.descripcion && <p className="text-red-500 text-xs m-0 mt-1">{errores.descripcion}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivos preliminares de intervención (Op.)</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white"
                  placeholder="Qué se busca lograr a corto/mediano plazo..."
                  value={objetivos}
                  onChange={e => setObjetivos(e.target.value)}
                />
                    {/* Tag addition hidden in edit mode for simplicity unless implemented against backend API */}
               </div>
            </div>
          </Card>

          <Card title="Prioridad asignada">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {([
                 { id: 'baja', color: 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400', txt: 'Baja', sub: 'Sin urgencia' },
                 { id: 'media', color: 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400', txt: 'Media', sub: 'Seguimiento normal' },
                 { id: 'alta', color: 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400', txt: 'Alta', sub: 'Atención urgente' }
               ] as const).map(p => (
                 <div 
                   key={p.id}
                   onClick={() => setPrioridad(p.id)}
                   className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                     prioridad === p.id 
                       ? `border-primary shadow-sm bg-primary/5 dark:bg-primary/10` 
                       : `border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-[#242424] dark:hover:bg-[#2a2a2a]`
                   }`}
                 >
                   <div className={`w-3 h-3 rounded-full mb-3 shadow-inner blur-[1px] ${p.color.split(' ')[0]}`}></div>
                   <span className="font-bold text-gray-900 dark:text-gray-100">{p.txt}</span>
                   <span className="text-xs text-gray-500 mt-1">{p.sub}</span>
                 </div>
               ))}
            </div>
          </Card>

        </div>

        {/* COLUMNA LATERAL 1/3 */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          <Card title="Estado del caso">
            <div className="flex flex-col gap-2">
              {['abierto', 'en_proceso', 'cerrado', 'derivado'].map(st => (
                <label key={st} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-primary/50 cursor-pointer bg-gray-50/50 dark:bg-[#242424]">
                  <input type="radio" value={st} checked={estado === st} onChange={() => setEstado(st as EstadoCaso)} className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                  <span className="capitalize text-sm font-medium text-gray-800 dark:text-gray-200">{st.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Próxima revisión">
            <div className="flex flex-col gap-3">
               <Input type="date" value={proximaRevision} onChange={e => setProximaRevision(e.target.value)} />
               <div className="flex gap-3 items-start p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/50">
                 <span className="text-lg leading-none">ℹ️</span>
                 <span>Se enviará una alerta automática al profesional a cargo en esa fecha.</span>
               </div>
            </div>
          </Card>

          <Card title="Etiquetas visuales">
            <div className="flex flex-col gap-4">
              {etiquetas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {etiquetas.map(e => (
                    <span key={e.id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-white font-medium" style={{ backgroundColor: e.color || '#C97A8A' }}>
                      {e.nombre}
                      <button onClick={() => removeEtiqueta(e.id)} className="ml-1 opacity-70 hover:opacity-100 text-white bg-transparent border-none cursor-pointer leading-none p-0">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-40 transition-colors">
        <div className="flex justify-end gap-3 max-w-[1200px] mx-auto w-full pr-12 lg:pr-6">
           <Button variant="secondary" onClick={() => navigate(`/casos/${id!.replace('#','')}`)}>Cancelar</Button>
           <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
             {isPending ? 'Guardando...' : 'Guardar cambios →'}
           </Button>
        </div>
      </div>

    </div>
  );
};
