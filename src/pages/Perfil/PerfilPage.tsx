import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Toast } from '../../components/ui/Toast';
import { useAuthContext as useAuth } from '../../context/AuthContext';
import { PreferenciasForm } from '../../components/ui/PreferenciasForm';

export const PerfilPage = () => {
  const { user } = useAuth();

  // Local state for forms
  const [formNombre, setFormNombre] = useState(user?.nombre || '');
  const [formPassword, setFormPassword] = useState({ actual: '', nueva: '', confirmar: '' });
  const [mostrarPassword, setMostrar] = useState({ actual: false, nueva: false, confirmar: false });
  const [erroresPassword, setErrPass] = useState<Record<string, string>>({});
  
  // UI state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'|'warning'>('success');

  useEffect(() => {
    document.title = 'Mi Perfil | Agenda Social';
  }, []);

  const triggerToast = (msg: string, type: 'success'|'error'|'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  // 1. Info Form
  const handleSaveInfo = () => {
    if (formNombre.trim() === '') return;
    triggerToast('Perfil actualizado correctamente');
  };
  const isInfoChanged = formNombre !== (user?.nombre || '');

  // 2. Pass Form
  const validatePass = () => {
    const errs: Record<string, string> = {};
    if (!formPassword.actual) errs.actual = 'Ingresa tu contraseña actual';
    if (formPassword.nueva.length < 8) errs.nueva = 'Mínimo 8 caracteres';
    if (formPassword.nueva === formPassword.actual && formPassword.nueva !== '') errs.nueva = 'No puede ser igual a tu contraseña actual';
    if (formPassword.confirmar !== formPassword.nueva) errs.confirmar = 'Las contraseñas no coinciden';
    setErrPass(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePass = () => {
    if (!validatePass()) return;
    setFormPassword({ actual: '', nueva: '', confirmar: '' });
    triggerToast('Contraseña cambiada exitosamente');
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1200px] mx-auto min-h-screen">
      {showToast && <Toast mensaje={toastMessage} tipo={toastType} onClose={() => setShowToast(false)} />}
      
      {/* HEADER */}
      <div className="flex flex-col gap-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">Mi perfil</h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">Gestiona tu información personal y credenciales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA PRINCIPAL 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card title="Información personal">
             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
               <Avatar name={user?.nombre || 'Usuario'} size="lg" className="w-[80px] h-[80px] text-3xl" />
               <div className="flex flex-col w-full gap-4">
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre completo *</label>
                   <Input value={formNombre} onChange={e => setFormNombre(e.target.value)} />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                   <Input value={user?.email || ''} disabled />
                   <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                     <span>ℹ️</span> El email no puede modificarse desde esta pantalla.
                   </div>
                 </div>

                 <div className="flex flex-col items-start gap-2">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol asignado</label>
                   <Badge estado={user?.role === 'ADMIN' ? 'abierto' : 'en_proceso'}>{user?.role === 'ADMIN' ? 'Administrador' : 'Trabajador Social'}</Badge>
                   <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                     <span>ℹ️</span> El rol solo puede cambiarlo un administrador global.
                   </div>
                 </div>

               </div>
             </div>
             
             <div className="flex justify-end">
               <Button variant="primary" onClick={handleSaveInfo} disabled={!isInfoChanged || formNombre.trim() === ''}>
                 Guardar cambios
               </Button>
             </div>
          </Card>

          <Card title="Cambiar contraseña">
             <div className="flex flex-col gap-5">
               
               {/* Actual */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña actual *</label>
                  <div className="relative">
                    <input
                      type={mostrarPassword.actual ? 'text' : 'password'}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 dark:bg-[#242424] dark:text-white transition-colors ${erroresPassword.actual ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700'}`}
                      value={formPassword.actual}
                      onChange={e => setFormPassword({ ...formPassword, actual: e.target.value })}
                    />
                    <button type="button" onClick={() => setMostrar({ ...mostrarPassword, actual: !mostrarPassword.actual })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                      {mostrarPassword.actual ? '👁️' : '🕶️'}
                    </button>
                  </div>
                  {erroresPassword.actual && <p className="text-red-500 text-xs m-0 mt-1">{erroresPassword.actual}</p>}
               </div>

               {/* Nueva */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva contraseña *</label>
                  <div className="relative">
                    <input
                      type={mostrarPassword.nueva ? 'text' : 'password'}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 dark:bg-[#242424] dark:text-white transition-colors ${erroresPassword.nueva ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700'}`}
                      value={formPassword.nueva}
                      onChange={e => setFormPassword({ ...formPassword, nueva: e.target.value })}
                    />
                    <button type="button" onClick={() => setMostrar({ ...mostrarPassword, nueva: !mostrarPassword.nueva })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                      {mostrarPassword.nueva ? '👁️' : '🕶️'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>ℹ️</span> Mínimo 8 caracteres
                  </div>
                  {erroresPassword.nueva && <p className="text-red-500 text-xs m-0 mt-1">{erroresPassword.nueva}</p>}
               </div>

               {/* Confirmar */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar nueva contraseña *</label>
                  <div className="relative">
                    <input
                      type={mostrarPassword.confirmar ? 'text' : 'password'}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 dark:bg-[#242424] dark:text-white transition-colors ${erroresPassword.confirmar ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700'}`}
                      value={formPassword.confirmar}
                      onChange={e => setFormPassword({ ...formPassword, confirmar: e.target.value })}
                    />
                    <button type="button" onClick={() => setMostrar({ ...mostrarPassword, confirmar: !mostrarPassword.confirmar })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                      {mostrarPassword.confirmar ? '👁️' : '🕶️'}
                    </button>
                  </div>
                  {erroresPassword.confirmar && <p className="text-red-500 text-xs m-0 mt-1">{erroresPassword.confirmar}</p>}
               </div>

             </div>

             <div className="flex justify-end mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
               <Button variant="secondary" onClick={handleSavePass}>
                 Cambiar contraseña
               </Button>
             </div>
          </Card>

          <Card title="Preferencias del Sistema">
            <PreferenciasForm />
          </Card>

        </div>

        {/* COLUMNA LATERAL 1/3 */}
        <div className="lg:col-span-1 flex flex-col gap-6">

           <Card title="Resumen">
             <div className="flex flex-col items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800">
                <Avatar name={user?.nombre || 'U'} size="lg" className="w-[64px] h-[64px] text-2xl shadow-sm" />
                <div className="text-center">
                  <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{user?.nombre}</h3>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
                <Badge estado={user?.role === 'ADMIN' ? 'abierto' : 'en_proceso'} className="mt-1">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Trabajador Social'}
                </Badge>
             </div>
             
             <div className="flex flex-col gap-3 py-4 text-sm">
               <div className="flex justify-between items-center text-gray-500">
                 <span>Cuenta creada:</span>
                 <span className="font-medium text-gray-900 dark:text-gray-100 text-right">01/01/2024</span>
               </div>
               <div className="flex justify-between items-center text-gray-500">
                 <span>Último acceso:</span>
                 <span className="font-medium text-gray-900 dark:text-gray-100 text-right">Hoy, 10:30</span>
               </div>
               <div className="flex justify-between items-center text-gray-500">
                 <span>Tipo de cuenta:</span>
                 <span className="font-medium text-amber-600 dark:text-amber-500 text-right uppercase tracking-wider text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                   Demo Local
                 </span>
               </div>
             </div>
             
           </Card>

        </div>
      </div>
    </div>
  );
};
