import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard';
import { LoginPage } from '../pages/Login';
import { RootGuard, RequireAuth } from './guards';
import { AppLayout } from '../components/layout/AppLayout';

// Stubs (to be created)
import { CasosPage, NuevoCasoPage, DetalleCasoPage } from '../pages/Casos';
import { BeneficiariosPage, FichaBeneficiarioPage } from '../pages/Beneficiarios';
import { PerfilPage } from '../pages/Perfil';
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
        element: <FichaBeneficiarioPage />,
      },
      {
        path: '/perfil',
        element: <PerfilPage />,
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
