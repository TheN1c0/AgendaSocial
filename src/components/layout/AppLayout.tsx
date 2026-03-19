import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import './AppLayout.css';

export const AppLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
