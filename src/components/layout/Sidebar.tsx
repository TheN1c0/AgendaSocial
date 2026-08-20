import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';
import { useHelp, ONBOARDING_STEPS } from '../../context/HelpContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuthContext();
  const location = useLocation();
  const { isOnboardingOpen, currentStepIndex } = useHelp();

  const isCurrent = (path: string) => location.pathname === path;
  
  // Elemento enfocado en el Onboarding
  const currentTourTarget = isOnboardingOpen ? ONBOARDING_STEPS[currentStepIndex]?.targetNavKey : null;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isOnboardingOpen ? '!z-[60] relative shadow-2xl' : ''}`}>
      <div className="sidebar-header flex justify-between items-center relative">
        <div>
          <h2>Gestor de Casos</h2>
          <p>Trabajo Social</p>
        </div>
        <button className="sidebar-close-btn md:hidden absolute right-4 top-4" onClick={onClose} aria-label="Cerrar menú">
           ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Principal</div>
        
        {/* DASHBOARD */}
        <Link 
          to="/dashboard" 
          id="tour-nav-dashboard"
          className={`nav-item relative transition-all duration-300 ${
            isCurrent('/dashboard') ? 'active' : ''
          } ${
            isOnboardingOpen && currentTourTarget !== 'dashboard' ? 'opacity-50 hover:opacity-90' : ''
          } ${
            currentTourTarget === 'dashboard'
              ? '!bg-white/25 dark:!bg-white/20 !border-l-4 !border-white font-bold ring-2 ring-white shadow-[0_0_25px_rgba(201,122,138,0.9)] scale-[1.04] !opacity-100'
              : ''
          }`}
        >
          <span className="nav-icon">⊞</span>
          <span>Dashboard</span>
          {currentTourTarget === 'dashboard' && (
            <span className="ml-auto text-[10px] bg-white text-primary font-bold px-2 py-0.5 rounded-full animate-bounce shadow-md">
              Paso 1
            </span>
          )}
        </Link>

        {/* CASOS */}
        <Link 
          to="/casos" 
          id="tour-nav-casos"
          className={`nav-item relative transition-all duration-300 ${
            isCurrent('/casos') ? 'active' : ''
          } ${
            isOnboardingOpen && currentTourTarget !== 'casos' ? 'opacity-50 hover:opacity-90' : ''
          } ${
            currentTourTarget === 'casos'
              ? '!bg-white/25 dark:!bg-white/20 !border-l-4 !border-white font-bold ring-2 ring-white shadow-[0_0_25px_rgba(201,122,138,0.9)] scale-[1.04] !opacity-100'
              : ''
          }`}
        >
          <span className="nav-icon">≡</span>
          <span>Casos</span>
          {currentTourTarget === 'casos' && (
            <span className="ml-auto text-[10px] bg-white text-primary font-bold px-2 py-0.5 rounded-full animate-bounce shadow-md">
              {currentStepIndex === 2 ? 'Paso 3' : 'Paso 4'}
            </span>
          )}
        </Link>

        {/* BENEFICIARIOS */}
        <Link 
          to="/beneficiarios" 
          id="tour-nav-beneficiarios"
          className={`nav-item relative transition-all duration-300 ${
            isCurrent('/beneficiarios') ? 'active' : ''
          } ${
            isOnboardingOpen && currentTourTarget !== 'beneficiarios' ? 'opacity-50 hover:opacity-90' : ''
          } ${
            currentTourTarget === 'beneficiarios'
              ? '!bg-white/25 dark:!bg-white/20 !border-l-4 !border-white font-bold ring-2 ring-white shadow-[0_0_25px_rgba(201,122,138,0.9)] scale-[1.04] !opacity-100'
              : ''
          }`}
        >
          <span className="nav-icon">👤</span>
          <span>Beneficiarios</span>
          {currentTourTarget === 'beneficiarios' && (
            <span className="ml-auto text-[10px] bg-white text-primary font-bold px-2 py-0.5 rounded-full animate-bounce shadow-md">
              Paso 2
            </span>
          )}
        </Link>

        <div className="nav-section-title">Sistema</div>

        <Link to="/configuracion" className={`nav-item ${isCurrent('/configuracion') ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>Configuración</span>
        </Link>
        <Link to="/notificaciones" className={`nav-item ${isCurrent('/notificaciones') ? 'active' : ''}`}>
          <span className="nav-icon">☁️</span>
          <span>Notificaciones</span>
        </Link>
      </nav>

      <button 
        onClick={logout} 
        className="nav-item w-full"
        style={{ background: 'transparent', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', textAlign: 'left', color: 'inherit', padding: '1rem 1.5rem' }}
      >
        <span className="nav-icon">🚪</span>
        <span style={{ fontWeight: 600 }}>Cerrar sesión</span>
      </button>

      <div className="sidebar-footer">
        <div className="theme-toggle-wrapper">
          <span>☼</span>
          <span>Tema oscuro</span>
        </div>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={theme === 'dark'} 
            onChange={toggleTheme} 
          />
          <span className="slider round"></span>
        </label>
      </div>
    </aside>
  );
};
