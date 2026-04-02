import { useState, useEffect } from 'react';
import type { DashboardWidget } from '../types/dashboard.types';

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'casos-por-estado',
    type: 'donut',
    title: 'Casos por estado',
    subtitle: 'Distribución actual',
    visible: true,
    order: 0,
    dataSource: 'casos-por-estado',
    config: {
      data: [18, 14, 12, 4],
      labels: ['Abierto', 'En proceso', 'Cerrado', 'Derivado'],
      colors: ['#C97A8A', '#378ADD', '#888780', '#BA7517'],
    }
  },
  {
    id: 'nuevos-vs-cerrados',
    type: 'bar',
    title: 'Nuevos vs Cerrados',
    subtitle: 'Últimos períodos',
    visible: true,
    order: 1,
    dataSource: 'nuevos-vs-cerrados',
    config: {
      periodo: 'mes',
      datasets: [
        { label: 'Nuevos',   data: [8,12,7,15,10,13], color: '#C97A8A' },
        { label: 'Cerrados', data: [5,9,6,8,7,10],    color: '#E8E8E6' },
      ]
    }
  },
  {
    id: 'evolucion-activos',
    type: 'line',
    title: 'Evolución de casos activos',
    subtitle: 'Tendencia',
    visible: true,
    order: 2,
    dataSource: 'evolucion-activos',
    config: {
      periodo: 'semana',
      data: [32,35,38,34,40,44,41,48],
      color: '#C97A8A',
      filled: true,
    }
  },
  {
    id: 'carga-profesional',
    type: 'horizontalBar',
    title: 'Carga por profesional',
    subtitle: 'Casos asignados',
    visible: true,
    order: 3,
    dataSource: 'carga-profesional',
    config: {
      data: [14, 12, 10, 8],
      labels: ['Marta G.', 'Diego R.', 'Ana B.', 'Carlos F.'],
      colors: ['#C97A8A', '#E8A0B0', '#F0C0CC', '#F7E8EC'],
    }
  },
];

const STORAGE_KEY = 'dashboard-widgets';

export const useDashboardWidgets = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing dashboard widgets from localStorage', e);
    }
    return DEFAULT_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const toggleVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets(prev => {
      const index = prev.findIndex(w => w.id === id);
      if (index < 0) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newWidgets = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      const tempOrder = newWidgets[index].order;
      newWidgets[index].order = newWidgets[targetIndex].order;
      newWidgets[targetIndex].order = tempOrder;

      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;

      return newWidgets;
    });
  };

  const updateWidgetConfig = (id: string, configUpdates: Partial<DashboardWidget['config']>) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, config: { ...w.config, ...configUpdates } } : w
    ));
  };

  return {
    widgets,
    setWidgets,
    toggleVisibility,
    moveWidget,
    updateWidgetConfig
  };
};
