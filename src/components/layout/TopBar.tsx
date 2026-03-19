import { useAuthContext } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import './TopBar.css';

export const TopBar = () => {
  const { user } = useAuthContext();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Input 
          type="text" 
          placeholder="Buscar casos, beneficiarios..." 
          style={{ marginBottom: 0 }} // Override to fit TopBar
        />
      </div>

      <div className="topbar-actions">
        <button className="btn-icon" aria-label="Notificaciones">
          🔔
        </button>
        
        <button className="user-profile-badge">
          <Avatar name={user?.name || 'Marta Gómez'} size="sm" />
          <div className="user-info">
            <span className="user-name">{user?.name || 'Marta Gómez'}</span>
            <span className="user-role">Trabajadora Social</span>
          </div>
        </button>
      </div>
    </header>
  );
};
