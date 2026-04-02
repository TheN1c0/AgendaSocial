import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { DashboardWidget, DataSourceType } from '../../types/dashboard.types';

interface WidgetConfigModalProps {
  widget: DashboardWidget | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DashboardWidget>) => void;
}

type TabType = 'datos' | 'apariencia' | 'periodo';

export const WidgetConfigModal = ({ widget, isOpen, onClose, onSave }: WidgetConfigModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('datos');
  const [editedWidget, setEditedWidget] = useState<DashboardWidget | null>(null);

  useEffect(() => {
    if (widget && isOpen) {
      // Deep copy to avoid mutating the original until saved
      setEditedWidget(JSON.parse(JSON.stringify(widget)));
      setActiveTab('datos');
    }
  }, [widget, isOpen]);

  if (!isOpen || !editedWidget) return null;

  const { type, config } = editedWidget;
  const isMultiSeries = type === 'bar' || (type === 'line' && config.datasets);
  const showPeriodo = type === 'bar' || type === 'line';

  const handleSave = () => {
    onSave(editedWidget.id, editedWidget);
    onClose();
  };

  const updateConfig = (updates: Partial<DashboardWidget['config']>) => {
    setEditedWidget({ ...editedWidget, config: { ...editedWidget.config, ...updates } });
  };

  // --- RENDERING TABS ---

  const renderDatosTab = () => {
    const dataSourceSelector = (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Origen de Datos</label>
        <select
          value={editedWidget.dataSource || 'manual'}
          onChange={(e) => setEditedWidget({ ...editedWidget, dataSource: e.target.value as DataSourceType })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-[#1a1a1a] dark:border-gray-700 dark:text-gray-100 p-2"
        >
          <option value="manual">Ingresar datos manualmente</option>
          <option value="casos-por-estado">Variables Reales: Casos por Estado</option>
          <option value="carga-profesional">Variables Reales: Carga por Trabajador</option>
          <option value="nuevos-vs-cerrados">Variables Reales: Nuevos vs Cerrados</option>
          <option value="evolucion-activos">Variables Reales: Evolución de Activos</option>
        </select>
        {editedWidget.dataSource && editedWidget.dataSource !== 'manual' && (
          <p className="mt-3 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            ℹ️ <strong>Usando datos reales:</strong> Los valores que ingreses abajo serán ignorados y se mostrarán los datos reales de la base de datos para este gráfico ("{editedWidget.dataSource}"). 
            (Aún puedes editar colores).
          </p>
        )}
      </div>
    );

    if (isMultiSeries && config.datasets) {
      return (
        <div className="flex flex-col gap-4">
          {dataSourceSelector}
          <div className={`${editedWidget.dataSource && editedWidget.dataSource !== 'manual' ? 'opacity-50 pointer-events-none' : ''}`}>
            <p className="text-sm text-gray-500 mb-2 pointer-events-auto">Etiquetas (Eje X)</p>
          <div className="flex flex-wrap gap-2">
            {(config.labels || []).map((label, idx) => (
              <Input 
                key={idx} 
                value={label} 
                onChange={(e) => {
                  const newLabels = [...(config.labels || [])];
                  newLabels[idx] = e.target.value;
                  updateConfig({ labels: newLabels });
                }}
                className="w-24"
              />
            ))}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Series de Datos</p>
            {config.datasets.map((ds, dsIdx) => (
              <div key={dsIdx} className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                    value={ds.label} 
                    onChange={(e) => {
                      const newDs = [...config.datasets!];
                      newDs[dsIdx] = { ...ds, label: e.target.value };
                      updateConfig({ datasets: newDs });
                    }}
                    className="flex-1"
                  />
                  <input 
                    type="color" 
                    value={ds.color || '#000000'} 
                    onChange={(e) => {
                      const newDs = [...config.datasets!];
                      newDs[dsIdx] = { ...ds, color: e.target.value };
                      updateConfig({ datasets: newDs });
                    }}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ds.data.map((val, valIdx) => (
                    <Input 
                      key={valIdx}
                      type="number"
                      value={val.toString()}
                      onChange={(e) => {
                        const newDs = [...config.datasets!];
                        const newData = [...ds.data];
                        newData[valIdx] = Number(e.target.value);
                        newDs[dsIdx] = { ...ds, data: newData };
                        updateConfig({ datasets: newDs });
                      }}
                      className="w-20"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      );
    }

    // Single series (Donut, Line without datasets, HorizontalBar)
    return (
      <div className="flex flex-col gap-4">
        {dataSourceSelector}
        <div className={`flex flex-col gap-4 ${editedWidget.dataSource && editedWidget.dataSource !== 'manual' ? 'opacity-50' : ''}`}>
        {config.data?.map((val, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input 
              value={config.labels?.[idx] || ''} 
              onChange={(e) => {
                const newLabels = [...(config.labels || [])];
                newLabels[idx] = e.target.value;
                updateConfig({ labels: newLabels });
              }}
              placeholder="Etiqueta"
              className="flex-1"
            />
            <Input 
              type="number"
              value={val.toString()} 
              onChange={(e) => {
                const newData = [...(config.data || [])];
                newData[idx] = Number(e.target.value);
                updateConfig({ data: newData });
              }}
              className="w-24"
            />
            <input 
              type="color"
              value={config.colors?.[idx] || config.color || '#000000'}
              onChange={(e) => {
                if (type === 'line') {
                  updateConfig({ color: e.target.value });
                } else {
                  const newColors = [...(config.colors || [])];
                  newColors[idx] = e.target.value;
                  updateConfig({ colors: newColors });
                }
              }}
              className="w-10 h-10 rounded cursor-pointer border-0 p-1"
            />
            <button 
              onClick={() => {
                const newData = [...(config.data || [])];
                const newLabels = [...(config.labels || [])];
                const newColors = config.colors ? [...config.colors] : [];
                newData.splice(idx, 1);
                newLabels.splice(idx, 1);
                if (newColors.length) newColors.splice(idx, 1);
                updateConfig({ data: newData, labels: newLabels, colors: newColors.length ? newColors : undefined });
              }}
              className="px-2 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
            >
              ×
            </button>
          </div>
        ))}
        <Button 
          variant="secondary" 
          onClick={() => {
            updateConfig({
              data: [...(config.data || []), 0],
              labels: [...(config.labels || []), 'Nuevo'],
              colors: config.colors ? [...config.colors, '#cccccc'] : undefined
            });
          }}
          className="mt-2 self-start"
        >
          + Agregar fila
        </Button>
        </div>
      </div>
    );
  };

  const renderAparienciaTab = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
        <Input 
          value={editedWidget.title} 
          onChange={(e) => setEditedWidget({ ...editedWidget, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
        <Input 
          value={editedWidget.subtitle || ''} 
          onChange={(e) => setEditedWidget({ ...editedWidget, subtitle: e.target.value })}
        />
      </div>
      {type === 'line' && (
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="chkFilled"
            checked={!!config.filled}
            onChange={(e) => updateConfig({ filled: e.target.checked })}
            className="w-4 h-4 text-primary rounded border-gray-300"
          />
          <label htmlFor="chkFilled" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Área rellena bajo la línea
          </label>
        </div>
      )}
    </div>
  );

  const renderPeriodoTab = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona el período por defecto que mostrará este gráfico.</p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="periodo" 
            value="semana" 
            checked={config.periodo === 'semana'}
            onChange={() => updateConfig({ periodo: 'semana' })}
            className="text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">Semana</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="periodo" 
            value="mes" 
            checked={config.periodo === 'mes'}
            onChange={() => updateConfig({ periodo: 'mes' })}
            className="text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">Mes</span>
        </label>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configurar: ${editedWidget.title}`} size="lg">
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px space-x-6">
          <button
            onClick={() => setActiveTab('datos')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'datos' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
          >
            Datos
          </button>
          <button
            onClick={() => setActiveTab('apariencia')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'apariencia' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
          >
            Apariencia
          </button>
          {showPeriodo && (
            <button
              onClick={() => setActiveTab('periodo')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'periodo' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Período
            </button>
          )}
        </nav>
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'datos' && renderDatosTab()}
        {activeTab === 'apariencia' && renderAparienciaTab()}
        {activeTab === 'periodo' && renderPeriodoTab()}
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </Modal>
  );
};
