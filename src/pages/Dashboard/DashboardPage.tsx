import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { useDashboardWidgets } from '../../hooks/useDashboardWidgets';
import type { DashboardWidget, ChartType } from '../../types/dashboard.types';
import { WidgetCard } from '../../components/dashboard/WidgetCard';
import { WidgetConfigModal } from '../../components/dashboard/WidgetConfigModal';
import { AddWidgetModal } from '../../components/dashboard/AddWidgetModal';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---
const kpis = [
  { label: 'Casos activos', value: 48, sub: 'En seguimiento' },
  { label: 'Nuevos este mes', value: 12, sub: '+3 vs mes anterior', accent: true },
  { label: 'Casos cerrados', value: 7, sub: 'Este mes' },
  { label: 'Trabajadores activos', value: 5, sub: 'Con casos asignados' },
];

const ultimosCasos = [
  { id: '4512', idLabel: '#4512', cliente: 'Ana G. Morales', estado: 'en_proceso', prioridad: 'alta', ts: 'Diego Rivas', initials: 'DR', fecha: '12/10/2023', ultima: '25/10/2023' },
  { id: '4511', idLabel: '#4511', cliente: 'Luis J. Pérez', estado: 'derivado', prioridad: 'media', ts: 'Marta Gómez', initials: 'MG', fecha: '10/10/2023', ultima: '24/10/2023' },
  { id: '4510', idLabel: '#4510', cliente: 'María L. Ruiz', estado: 'cerrado', prioridad: 'baja', ts: 'Diego Rivas', initials: 'DR', fecha: '05/10/2023', ultima: '23/10/2023' },
];

const actividad = [
  { usuario: 'Marta G.', accion: 'actualizó', caso: '#4511', tiempo: 'Hace 10 min' },
  { usuario: 'Diego R.', accion: 'cerró',     caso: '#4510', tiempo: 'Hace 45 min' },
  { usuario: 'Ana B.',   accion: 'abrió',     caso: '#4512', tiempo: 'Hace 1 h'    },
  { usuario: 'Carlos F.', accion: 'derivó',   caso: '#4509', tiempo: 'Hace 2 h'    },
];

export const DashboardPage = () => {
  const { widgets, toggleVisibility, moveWidget, updateWidgetConfig, setWidgets } = useDashboardWidgets();
  
  // Modal states
  const [isGeneralConfigOpen, setIsGeneralConfigOpen] = useState(false);
  const [activeConfigWidget, setActiveConfigWidget] = useState<DashboardWidget | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  useEffect(() => {
    document.title = 'Inicio | Agenda Social';
  }, []);

  const handleAddWidget = (type: ChartType, title: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      visible: true,
      order: widgets.length,
      config: {
        labels: ['Dato A', 'Dato B'],
        data: type !== 'bar' ? [10, 20] : undefined,
        colors: type !== 'bar' ? ['#C97A8A', '#378ADD'] : undefined,
        color: type === 'line' ? '#C97A8A' : undefined,
        filled: type === 'line' ? true : undefined,
        periodo: (type === 'bar' || type === 'line') ? 'mes' : undefined,
        datasets: type === 'bar' ? [{ label: 'Serie 1', data: [10, 20], color: '#C97A8A' }] : undefined,
      }
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleSaveWidgetConfig = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto">
      
      {/* HEADER / TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">
          Panel Administrativo <span className="text-gray-400 font-normal">- Visión General</span>
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsGeneralConfigOpen(true)}>⚙️ Ocultos</Button>
          <Button variant="primary" size="sm" onClick={() => setIsAddWidgetOpen(true)}>+ Agregar gráfico</Button>
        </div>
      </div>

      {/* KPIs ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} noPadding className="p-4 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</span>
              {kpi.accent && <Badge className="h-5 bg-green-100 text-green-800">↑</Badge>}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-bold ${kpi.accent ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                {kpi.value}
              </span>
              {kpi.sub && <span className="text-sm text-gray-500">{kpi.sub}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column (Lists & Widgets) */}
        <div className="flex flex-col gap-6 xl:col-span-3">
          
          {/* Table */}
          <Card title="Últimos Casos Actualizados" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">ID</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Beneficiario</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Estado</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Prioridad</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Profesional</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Última Actividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ultimosCasos.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/casos/${c.id}`} className="text-primary hover:underline">{c.idLabel}</Link>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{c.cliente}</td>
                      <td className="px-4 py-3">
                        <Badge estado={c.estado as any}>
                          {c.estado === 'en_proceso' ? 'En procs.' : c.estado === 'derivado' ? 'Asignado' : 'Cerrado'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge prioridad={c.prioridad as any}>
                          {c.prioridad.charAt(0).toUpperCase() + c.prioridad.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                           <Avatar name={c.ts} size="sm" />
                           <span className="text-gray-600 dark:text-gray-400">{c.ts}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.ultima}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Widgets Grid */}
          {visibleWidgets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleWidgets.map((widget) => (
                <WidgetCard 
                  key={widget.id} 
                  widget={widget} 
                  onHide={toggleVisibility}
                  onConfig={(w) => setActiveConfigWidget(w)}
                  onPeriodoChange={(id, p) => updateWidgetConfig(id, { periodo: p })}
                />
              ))}
            </div>
          )}
          {visibleWidgets.length === 0 && (
            <div className="p-8 text-center text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              No hay gráficos visibles. Usa el botón "⚙️ Ocultos" para recuperarlos.
            </div>
          )}

        </div>

        {/* Right Column (Activity Feed) */}
        <div className="xl:col-span-1">
          <Card title="Actividad Reciente" className="h-[calc(100%-1.5rem)]">
            <div className="flex flex-col gap-6 mt-4">
              {actividad.map((feed, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i !== actividad.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-1" />}
                  </div>
                  <div className="flex flex-col pb-2 w-full">
                    <p className="text-sm m-0 text-gray-800 dark:text-gray-200 leading-tight">
                      <span className="font-semibold">{feed.usuario}</span> {feed.accion} <Link to={`/casos/${feed.caso.replace('#','')}`} className="text-primary hover:underline">{feed.caso}</Link>
                    </p>
                    <span className="text-xs text-gray-500 mt-1">{feed.tiempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Modal for General Order and Visibility */}
      <Modal
        isOpen={isGeneralConfigOpen}
        onClose={() => setIsGeneralConfigOpen(false)}
        title="Administrar Widgets"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Personaliza qué gráficos quieres ver en tu panel y en qué orden.
        </p>
        <div className="flex flex-col gap-3">
          {widgets.map((widget, index) => (
            <div 
              key={widget.id} 
              className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                widget.visible 
                  ? 'bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-700' 
                  : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={widget.visible}
                  onChange={() => toggleVisibility(widget.id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{widget.title}</div>
                  <div className="text-xs text-gray-500">{widget.subtitle}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => moveWidget(widget.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 bg-transparent border-none cursor-pointer"
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveWidget(widget.id, 'down')}
                  disabled={index === widgets.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 bg-transparent border-none cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* 2. Modal for Editing Individual Widget Config */}
      <WidgetConfigModal 
        widget={activeConfigWidget} 
        isOpen={!!activeConfigWidget} 
        onClose={() => setActiveConfigWidget(null)} 
        onSave={handleSaveWidgetConfig}
      />

      {/* 3. Modal for Adding New Widget */}
      <AddWidgetModal 
        isOpen={isAddWidgetOpen} 
        onClose={() => setIsAddWidgetOpen(false)} 
        onAdd={handleAddWidget} 
      />

    </div>
  );
};
