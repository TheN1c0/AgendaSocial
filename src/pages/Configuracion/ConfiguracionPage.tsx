import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthContext as useAuth } from '../../context/AuthContext';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import { PreferenciasForm } from '../../components/ui/PreferenciasForm';
import { Button } from '../../components/ui/Button';

// Mock Defaults
const TIPOS_DEFAULT = [
  'Vulnerabilidad social',
  'Violencia intrafamiliar',
  'Situación de calle',
  'Adulto mayor en riesgo',
  'Infancia y adolescencia',
  'Discapacidad',
  'Otro',
];

const ETIQUETAS_DEFAULT = [
  { id: 'E001', nombre: 'Urgente',  color: '#E24B4A', usada: 3 },
  { id: 'E002', nombre: 'Familia',  color: '#1D9E75', usada: 5 },
  { id: 'E003', nombre: 'Vivienda', color: '#378ADD', usada: 2 },
  { id: 'E004', nombre: 'Empleo',   color: '#BA7517', usada: 1 },
  { id: 'E005', nombre: 'Salud',    color: '#534AB7', usada: 4 },
];

const USUARIOS_MOCK = [
  { id: 'U001', nombre: 'Marta Gómez',  email: 'marta@tuapp.cl', rol: 'trabajador_social', activo: true },
  { id: 'U002', nombre: 'Diego Rivas',  email: 'diego@tuapp.cl', rol: 'trabajador_social', activo: true },
  { id: 'U003', nombre: 'Ana Bravo',    email: 'ana@tuapp.cl',   rol: 'trabajador_social', activo: true },
  { id: 'U004', nombre: 'Admin',        email: 'admin@tuapp.cl', rol: 'admin',             activo: true },
];

const TAB_CONFIG = [
  { key: 'tipos', label: 'Tipos de caso' },
  { key: 'etiquetas', label: 'Etiquetas' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'preferencias', label: 'Preferencias' },
  { key: 'sistema', label: 'Sistema', onlyAdmin: true },
];

export const ConfiguracionPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isAdmin = user?.role === 'ADMIN';
  const tabQuery = searchParams.get('tab') || 'tipos';
  
  // Security Redirect logic on mount or tab change
  useEffect(() => {
    if (tabQuery === 'sistema' && !isAdmin) {
      setSearchParams({ tab: 'tipos' });
    }
  }, [tabQuery, isAdmin, setSearchParams]);

  const [tiposCaso, setTiposCaso] = useState(() => {
    const saved = localStorage.getItem('config-tipos-caso');
    return saved ? JSON.parse(saved) : TIPOS_DEFAULT;
  });

  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('config-etiquetas');
    return saved ? JSON.parse(saved) : ETIQUETAS_DEFAULT;
  });

  useEffect(() => {
    document.title = 'Configuración | Agenda Social';
  }, []);

  const handleChangeTab = (k: string) => {
    setSearchParams({ tab: k });
  };

  const removeTipo = (tipo: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${tipo}"?`)) {
       const next = tiposCaso.filter((t: string) => t !== tipo);
       setTiposCaso(next);
       localStorage.setItem('config-tipos-caso', JSON.stringify(next));
    }
  };

  const removeEtiqueta = (id: string, usada: number) => {
    if (usada > 0) {
      alert(`⚠️ Esta etiqueta está en uso en ${usada} casos. No se puede eliminar.`);
      return;
    }
    if (window.confirm('¿Eliminar etiqueta?')) {
      const next = etiquetas.filter((e: any) => e.id !== id);
      setEtiquetas(next);
      localStorage.setItem('config-etiquetas', JSON.stringify(next));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1000px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">Personaliza el sistema según tus necesidades operativas</p>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="px-6 pt-4">
           <Tabs tabs={TAB_CONFIG} activeTab={tabQuery} onChange={handleChangeTab} />
        </div>

        <div className="p-6">
           {/* TIPOS DE CASO */}
           {tabQuery === 'tipos' && (
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                   <div>
                     <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Tipos de caso</h3>
                     <p className="text-sm text-gray-500 m-0 mt-1">Define las categorías disponibles al crear casos.</p>
                   </div>
                   <Button variant="secondary" onClick={() => alert('Abrir modal Crear Tipo')}>+ Agregar tipo</Button>
                </div>

                <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                  {tiposCaso.map((tc: string, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-primary text-xs">●</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tc}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer" title="Editar">✏️</button>
                        <button onClick={() => removeTipo(tc)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer" title="Eliminar">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* ETIQUETAS */}
           {tabQuery === 'etiquetas' && (
             <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                   <div>
                     <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Etiquetas Visuales</h3>
                     <p className="text-sm text-gray-500 m-0 mt-1">Organiza y colorea los casos rápidamente.</p>
                   </div>
                   <Button variant="secondary" onClick={() => alert('Abrir modal Crear Etiqueta')}>+ Nueva etiqueta</Button>
                </div>

                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-800">
                  {etiquetas.map((e: any) => (
                    <span key={e.id} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-white font-medium" style={{ backgroundColor: e.color }}>
                      {e.nombre} <span className="opacity-50 text-[10px]">●</span>
                    </span>
                  ))}
                </div>

                <div>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Vista de lista completa</h4>
                   <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                     {etiquetas.map((e: any) => (
                        <div key={e.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#242424] gap-2 transition-colors">
                          <div className="flex items-center gap-3 w-1/3">
                            <span style={{ color: e.color }} className="text-lg leading-none">●</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{e.nombre}</span>
                          </div>
                          
                          <div className="flex gap-4 items-center justify-between w-full sm:w-2/3">
                            <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{e.color}</span>
                            <span className="text-xs text-gray-500 flex-1 ml-4 hidden sm:block">Usada en {e.usada} casos</span>
                            
                            <div className="flex gap-2 shrink-0">
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer" title="Editar">✏️</button>
                              <button onClick={() => removeEtiqueta(e.id, e.usada)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer" title="Eliminar">🗑</button>
                            </div>
                          </div>
                        </div>
                     ))}
                   </div>
                </div>
             </div>
           )}

           {/* DASHBOARD */}
           {tabQuery === 'dashboard' && (
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                   <div>
                     <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Widgets del dashboard</h3>
                     <p className="text-sm text-gray-500 m-0 mt-1">Activa o desactiva los gráficos que quieres ver en tu pantalla inicial.</p>
                   </div>
                   <Button variant="secondary" onClick={() => alert('Restaurar')}>Restaurar por defecto</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'casos-por-estado', title: 'Casos por estado', type: 'Dona', visible: true },
                    { id: 'nuevos-vs-cerrados', title: 'Nuevos vs Cerrados', type: 'Barras', visible: true },
                    { id: 'evolucion', title: 'Evolución de activos', type: 'Línea', visible: false },
                    { id: 'carga', title: 'Carga por profesional', type: 'Barras horiz.', visible: true },
                  ].map(w => (
                    <div key={w.id} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-[#1a1a1a]">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{w.title}</span>
                        <span className="text-xs text-gray-500 mt-1">Gráfico de {w.type} · {w.visible ? 'Visible' : 'Oculto'}</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={w.visible} onChange={() => {}} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* PREFERENCIAS */}
           {tabQuery === 'preferencias' && (
             <div className="flex flex-col gap-4 max-w-2xl">
               <div>
                 <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Preferencias de tu cuenta</h3>
                 <p className="text-sm text-gray-500 m-0 mt-1 mb-6">Esta configuración solo afecta a tu usuario y no a la plataforma global.</p>
               </div>
               <PreferenciasForm />
             </div>
           )}

           {/* SISTEMA */}
           {tabQuery === 'sistema' && isAdmin && (
             <div className="flex flex-col gap-8">
               
               <div>
                 <div className="flex justify-between items-center mb-4">
                   <div>
                     <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Gestión de usuarios</h3>
                     <p className="text-sm text-gray-500 m-0 mt-1">Administración de cuentas con acceso al sistema.</p>
                   </div>
                   <Button variant="secondary" onClick={() => alert('Modal usuario')}>+ Agregar usuario</Button>
                 </div>

                 <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
                   <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                     <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800">
                       <tr>
                         <th className="p-3 font-semibold text-gray-900 dark:text-gray-100">Nombre</th>
                         <th className="p-3 font-semibold text-gray-900 dark:text-gray-100">Email</th>
                         <th className="p-3 font-semibold text-gray-900 dark:text-gray-100">Rol</th>
                         <th className="p-3 font-semibold text-gray-900 dark:text-gray-100 text-center">Estado</th>
                         <th className="p-3 font-semibold text-gray-900 dark:text-gray-100 text-right">Acciones</th>
                       </tr>
                     </thead>
                     <tbody>
                       {USUARIOS_MOCK.map((u, i) => (
                         <tr key={u.id} className="border-b last:border-b-0 border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-[#242424]/50">
                           <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{u.nombre}</td>
                           <td className="p-3 text-gray-500">{u.email}</td>
                           <td className="p-3">
                             <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                               {u.rol === 'admin' ? 'Admin' : 'T.S.'}
                             </span>
                           </td>
                           <td className="p-3 text-center">
                             <span className="text-lg leading-none cursor-pointer" title={u.activo ? 'Desactivar' : 'Activar'}>
                               {u.activo ? '✅' : '❌'}
                             </span>
                           </td>
                           <td className="p-3 text-right">
                             <button className="text-primary hover:underline text-xs bg-transparent border-none cursor-pointer">Editar</button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               <div>
                  <h3 className="m-0 text-md font-bold text-gray-900 dark:text-gray-100 mb-3">Logs de actividad reciente</h3>
                  <div className="flex flex-col border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">
                    {[
                      { f: '25/10 10:30', u: 'Marta Gómez', a: 'actualizó', c: '#4511' },
                      { f: '25/10 09:15', u: 'Diego Rivas', a: 'cerró', c: '#4510' },
                      { f: '24/10 16:45', u: 'Ana Bravo', a: 'abrió', c: '#4512' },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 text-sm">
                        <span className="text-gray-500 font-mono text-xs mt-0.5">{log.f}</span>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{log.u}</span>{' '}
                          <span className="text-gray-500">{log.a}</span>{' '}
                          <span className="text-primary cursor-pointer hover:underline">{log.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

             </div>
           )}

        </div>
      </div>
    </div>
  );
};
