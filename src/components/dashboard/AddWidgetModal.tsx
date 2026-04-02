import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { ChartType } from '../../types/dashboard.types';
import { DonutChart, BarChart, LineChart, HorizontalBarChart } from '../charts';
import { CHART_COLORS } from '../../types/charts.types';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: ChartType, title: string) => void;
}

const PREVIEWS = [
  { id: 'donut', label: 'Torta / Donut', component: DonutChart, props: { labels: ['A', 'B'], data: [60, 40], colors: [CHART_COLORS.blue, CHART_COLORS.amber], height: 100 } },
  { id: 'bar', label: 'Barras', component: BarChart, props: { labels: ['Lun', 'Mar'], datasets: [{ label: 'Valores', data: [10, 20] }], height: 100 } },
  { id: 'line', label: 'Líneas', component: LineChart, props: { labels: ['Lun', 'Mar'], data: [10, 20], color: CHART_COLORS.green, height: 100 } },
  { id: 'horizontalBar', label: 'Barras Horizontales', component: HorizontalBarChart, props: { labels: ['A', 'B'], data: [20, 10], colors: [CHART_COLORS.primary, CHART_COLORS.secondary], height: 100 } }
] as const;

export const AddWidgetModal = ({ isOpen, onClose, onAdd }: AddWidgetModalProps) => {
  const [selectedType, setSelectedType] = useState<ChartType | null>(null);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (selectedType && title.trim()) {
      onAdd(selectedType, title);
      setTitle('');
      setSelectedType(null);
      onClose();
    }
  };

  const isFormValid = selectedType !== null && title.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Nuevo Gráfico" size="lg">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">1. Selecciona el tipo de gráfico</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PREVIEWS.map((preview) => (
              <div 
                key={preview.id}
                onClick={() => setSelectedType(preview.id as ChartType)}
                className={`border rounded-xl p-3 cursor-pointer transition-all ${
                  selectedType === preview.id 
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="h-28 flex items-center justify-center pointer-events-none mb-2">
                  <preview.component {...preview.props as any} />
                </div>
                <div className={`text-center text-sm font-medium ${selectedType === preview.id ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                  {preview.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">2. Dale un título a tu gráfico</label>
          <Input 
            placeholder="Ej: Casos por comuna central" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdd} disabled={!isFormValid}>Agregar Gráfico</Button>
        </div>
      </div>
    </Modal>
  );
};
