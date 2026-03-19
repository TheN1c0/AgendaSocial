import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { NotificacionItem } from '../ui/NotificacionItem';
import './TopBar.css';

export const TopBar = () => {
  const { user } = useAuthContext();
  const { notificaciones, noLeidas, marcarLeida } = useNotificaciones();
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadOnly = notificaciones.filter(n => !n.leida).slice(0, 3); // Max 3

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Input 
          type="text" 
          placeholder="Buscar casos... (ej #4512)" 
          style={{ marginBottom: 0 }} 
        />
      </div>

      <div className="topbar-actions relative" ref={dropdownRef}>
        <div className="relative">
          <button 
            className="btn-icon relative" 
            aria-label="Notificaciones"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            🔔
            {noLeidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-[#1a1a1a]">
                {noLeidas > 9 ? '9+' : noLeidas}
              </span>
            )}
          </button>
          
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
               <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                 <h3 className="m-0 text-sm font-bold text-gray-900 dark:text-gray-100">Notificaciones</h3>
                 <button onClick={() => { setDropdownOpen(false); navigate('/notificaciones'); }} className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer">
                   Ver todas &rarr;
                 </button>
               </div>
               
               <div className="flex flex-col max-h-[400px] overflow-y-auto">
                 {unreadOnly.length === 0 ? (
                   <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                     No hay notificaciones nuevas
                   </div>
                 ) : (
                   unreadOnly.map(n => (
                     <div key={n.id} onClick={() => setDropdownOpen(false)} className="border-b last:border-b-0 border-gray-50 dark:border-gray-800/50">
                       <NotificacionItem item={n} onMarcarLeida={marcarLeida} isDropdown={true} />
                     </div>
                   ))
                 )}
               </div>

               <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a]">
                 <button onClick={() => { setDropdownOpen(false); navigate('/notificaciones'); }} className="w-full py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                   Ir a la bandeja completa
                 </button>
               </div>
            </div>
          )}
        </div>
        
        <button className="user-profile-badge" onClick={() => navigate('/perfil')}>
          <Avatar name={user?.nombre || 'Usuario'} size="sm" />
          <div className="user-info">
             <span className="user-name">{user?.nombre || 'Usuario'}</span>
             <span className="user-role">{user?.role === 'ADMIN' ? 'Admin' : 'Trabajador Social'}</span>
          </div>
        </button>
      </div>
    </header>
  );
};
