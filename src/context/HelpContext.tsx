import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  route: string;
  badgeText?: string;
  targetNavKey: 'dashboard' | 'beneficiarios' | 'casos';
  keyFeatures: string[];
}

export const ONBOARDING_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    title: '1. Dashboard y Métricas',
    subtitle: 'Visión general de la gestión social',
    description: 'Accede a un resumen en tiempo real del equipo: total de casos activos, alertas de urgencia y gráficos de distribución por estado y tipo de atención.',
    icon: '📊',
    route: '/dashboard',
    badgeText: 'Vista General',
    targetNavKey: 'dashboard',
    keyFeatures: [
      'Indicadores clave (KPIs) en tiempo real',
      'Gráficos de casos por estado y evolución mensual',
      'Acceso rápido a los últimos casos registrados'
    ]
  },
  {
    id: 'beneficiarios',
    title: '2. Padrón de Beneficiarios',
    subtitle: 'Registro y fichas de personas atendidas',
    description: 'Centraliza los datos de contacto, RUT y ficha individual de cada persona o familia atendida para consultar su historial de atenciones previas.',
    icon: '👤',
    route: '/beneficiarios',
    badgeText: 'Padrón Centralizado',
    targetNavKey: 'beneficiarios',
    keyFeatures: [
      'Búsqueda rápida por nombre o RUT',
      'Filtro por profesional asignado y casos activos',
      'Registro directo de nuevos beneficiarios'
    ]
  },
  {
    id: 'casos',
    title: '3. Gestión de Casos',
    subtitle: 'Bandeja y filtros de expedientes sociales',
    description: 'Crea y administra las intervenciones sociales clasificándolas por nivel de prioridad, tipo de ayuda y profesional a cargo.',
    icon: '📁',
    route: '/casos',
    badgeText: 'Expedientes',
    targetNavKey: 'casos',
    keyFeatures: [
      'Filtros por estado (Pendiente, En Proceso, Resuelto)',
      'Clasificación por prioridad (Baja, Media, Urgente)',
      'Vista flexible en tabla personalizable o tarjetas'
    ]
  },
  {
    id: 'seguimiento',
    title: '4. Seguimiento y Bitácora',
    subtitle: 'Trazabilidad y avances en cada caso',
    description: 'Dentro de cada caso podrás registrar notas de intervención con fecha y hora, actualizar el estado del caso y consultar la línea de tiempo.',
    icon: '📝',
    route: '/casos',
    badgeText: 'Seguimiento Continuo',
    targetNavKey: 'casos',
    keyFeatures: [
      'Bitácora cronológica de intervenciones sociales',
      'Cambio de estados para reflejar la resolución',
      'Historial completo y trazabilidad de atención'
    ]
  }
];


interface HelpContextType {
  isOnboardingOpen: boolean;
  currentStepIndex: number;
  isGuiaRapidaOpen: boolean;
  isSectionHelpOpen: boolean;
  startOnboarding: () => void;
  closeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  openGuiaRapida: () => void;
  closeGuiaRapida: () => void;
  openSectionHelp: () => void;
  closeSectionHelp: () => void;
  getCurrentSectionInfo: () => { title: string; desc: string; icon: string; tips: string[] };
}

const STORAGE_KEY = 'agendasocial_onboarding_completed';

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isGuiaRapidaOpen, setIsGuiaRapidaOpen] = useState(false);
  const [isSectionHelpOpen, setIsSectionHelpOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Revisar si es el primer ingreso del usuario
  useEffect(() => {
    // Solo disparar onboarding si estamos en una ruta de la app (autenticado) y no se ha completado
    if (location.pathname !== '/login' && location.pathname !== '/') {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        // Retardo pequeño para permitir que la vista cargue suavemente
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  const startOnboarding = () => {
    setCurrentStepIndex(0);
    setIsOnboardingOpen(true);
    setIsGuiaRapidaOpen(false);
    setIsSectionHelpOpen(false);
    navigate(ONBOARDING_STEPS[0].route);
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const nextStep = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      navigate(ONBOARDING_STEPS[nextIdx].route);
    } else {
      closeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      navigate(ONBOARDING_STEPS[prevIdx].route);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < ONBOARDING_STEPS.length) {
      setCurrentStepIndex(index);
      navigate(ONBOARDING_STEPS[index].route);
    }
  };

  const openGuiaRapida = () => {
    setIsGuiaRapidaOpen(true);
    setIsOnboardingOpen(false);
  };

  const closeGuiaRapida = () => {
    setIsGuiaRapidaOpen(false);
  };

  const openSectionHelp = () => {
    setIsSectionHelpOpen(true);
  };

  const closeSectionHelp = () => {
    setIsSectionHelpOpen(false);
  };

  const getCurrentSectionInfo = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      return {
        title: 'Panel Administrativo (Dashboard)',
        desc: 'Visualiza indicadores consolidados de la gestión social.',
        icon: '📊',
        tips: [
          'Usa las tarjetas de KPI para monitorear urgencias y casos activos.',
          'Los gráficos te permiten evaluar la distribución por estado y tipo de apoyo.'
        ]
      };
    }
    if (path.includes('/beneficiarios')) {
      return {
        title: 'Padrón de Beneficiarios',
        desc: 'Listado y fichas individuales de las personas atendidas.',
        icon: '👤',
        tips: [
          'Escribe en la barra de búsqueda para filtrar por nombre o RUT al instante.',
          'Haz clic en cualquier beneficiario para ver su historial y casos asociados.',
          'Usa el botón "+ Nuevo Beneficiario" para ingresar a una persona al sistema.'
        ]
      };
    }
    if (path.startsWith('/casos/') && path !== '/casos/nuevo') {
      return {
        title: 'Detalle y Seguimiento del Caso',
        desc: 'Bitácora y administración del expediente social.',
        icon: '📝',
        tips: [
          'Usa "Agregar Intervención" para documentar visitas, llamadas o gestiones.',
          'Haz clic en "Cambiar Estado" para actualizar el flujo del caso.',
          'Revisa la información del beneficiario en la columna lateral.'
        ]
      };
    }
    if (path.includes('/casos')) {
      return {
        title: 'Bandeja de Casos Sociales',
        desc: 'Administración y filtrado de todas las intervenciones.',
        icon: '📁',
        tips: [
          'Filtra por Estado (Pendiente, En Proceso, Resuelto) o Prioridad (Urgente).',
          'Cambia entre vista Tabla y Tarjetas según tu preferencia.',
          'Usa "+ Nuevo Caso" para abrir una nueva intervención.'
        ]
      };
    }
    if (path.includes('/notificaciones')) {
      return {
        title: 'Centro de Notificaciones',
        desc: 'Alertas del sistema y avisos importantes.',
        icon: '🔔',
        tips: [
          'Consulta avisos automáticos sobre casos asignados y recordatorios.'
        ]
      };
    }
    return {
      title: 'Agenda Social',
      desc: 'Plataforma de gestión y seguimiento de casos sociales.',
      icon: '✨',
      tips: [
        'Utiliza el menú lateral para moverte entre secciones.',
        'Pulsa el botón de ayuda (?) en cualquier momento para repasar la guía.'
      ]
    };
  };

  return (
    <HelpContext.Provider
      value={{
        isOnboardingOpen,
        currentStepIndex,
        isGuiaRapidaOpen,
        isSectionHelpOpen,
        startOnboarding,
        closeOnboarding,
        nextStep,
        prevStep,
        goToStep,
        openGuiaRapida,
        closeGuiaRapida,
        openSectionHelp,
        closeSectionHelp,
        getCurrentSectionInfo
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp debe usarse dentro de un HelpProvider');
  }
  return context;
};
