import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard';
import { LoginPage } from '../pages/Login';
import { RootGuard } from './guards';
import { AppLayout } from '../components/layout/AppLayout';

// Pages
import { CasosPage, NuevoCasoPage, DetalleCasoPage } from '../pages/Casos';
import { BeneficiariosPage, BeneficiarioDetallePage } from '../pages/Beneficiarios';
import { PerfilPage } from '../pages/Perfil';
import { NotificacionesPage } from '../pages/Notificaciones';
import { ConfiguracionPage } from '../pages/Configuracion';
import { UsuariosAdminPage } from '../pages/Admin';

// Subcomponents pages
import { ComponentsShowcase } from '../pages/ComponentsShowcase';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootGuard />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // The AppLayout acts as the shell for all application pages
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/casos',
        element: <CasosPage />,
      },
      {
        path: '/casos/nuevo',
        element: <NuevoCasoPage />,
      },
      {
        path: '/casos/:id',
        element: <DetalleCasoPage />,
      },
      {
        path: '/beneficiarios',
        element: <BeneficiariosPage />,
      },
      {
        path: '/beneficiarios/:id',
        element: <BeneficiarioDetallePage />,
      },
      {
        path: '/perfil',
        element: <PerfilPage />,
      },
      {
        path: '/notificaciones',
        element: <NotificacionesPage />,
      },
      {
        path: '/configuracion',
        element: <ConfiguracionPage />,
      },
      {
        path: '/admin/usuarios',
        element: <UsuariosAdminPage />,
      }
    ]
  },
];

// Inyectar showcase solo en desarrollo
if (import.meta.env.DEV) {
  routes.push({
    path: '/components',
    element: <ComponentsShowcase />,
  });
}

export const router = createBrowserRouter(routes);
