import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { HelpProvider } from '../../context/HelpContext';
import {
  OnboardingTour,
  GuiaRapidaModal,
  SectionHelpModal,
  HelpFloatingButton
} from '../help';
import './AppLayout.css';

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <HelpProvider>
      <div className="dashboard-layout">
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main">
          <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>

        {/* Global Help & Onboarding Components */}
        <OnboardingTour />
        <GuiaRapidaModal />
        <SectionHelpModal />
        <HelpFloatingButton />
      </div>
    </HelpProvider>
  );
};

