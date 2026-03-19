import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Gestor de Casos</h2>
        <p>Trabajo Social</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Principal</div>
        <Link to="/dashboard" className={`nav-item ${isCurrent('/dashboard') ? 'active' : ''}`}>
          <span className="nav-icon">⊞</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/casos" className={`nav-item ${isCurrent('/casos') ? 'active' : ''}`}>
          <span className="nav-icon">≡</span>
          <span>Casos</span>
        </Link>
        <Link to="/beneficiarios" className={`nav-item ${isCurrent('/beneficiarios') ? 'active' : ''}`}>
          <span className="nav-icon">👤</span>
          <span>Beneficiarios</span>
        </Link>

        <div className="nav-section-title">Sistema</div>
        <Link to="/reportes" className={`nav-item ${isCurrent('/reportes') ? 'active' : ''}`}>
          <span className="nav-icon">≡</span>
          <span>Reportes</span>
        </Link>
        <Link to="/configuracion" className={`nav-item ${isCurrent('/configuracion') ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>Configuración</span>
        </Link>
        <Link to="/notificaciones" className={`nav-item ${isCurrent('/notificaciones') ? 'active' : ''}`}>
          <span className="nav-icon">☁️</span>
          <span>Notificaciones</span>
        </Link>
      </nav>

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
