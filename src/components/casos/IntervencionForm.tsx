import { useState } from 'react';
import { Button } from '../ui/Button';

interface IntervencionFormProps {
  onAdd: (descripcion: string) => void;
  onCancel: () => void;
}

export const IntervencionForm = ({ onAdd, onCancel }: IntervencionFormProps) => {
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descripcion.trim().length === 0) return;
    onAdd(descripcion.trim());
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Registra una nueva acción, visita, llamada o nota en el historial del caso. Esta acción quedará grabada con tu usuario y la fecha actual y no se podrá eliminar.
      </p>
      
      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción de la intervención
        </label>
        <textarea
          id="desc"
          rows={5}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white dark:placeholder-gray-500 dark:focus:border-primary dark:focus:ring-primary"
          placeholder="Ej: Se realiza visita domiciliaria acordada. Se constata que..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary" disabled={descripcion.trim().length === 0}>
          Guardar Intervención
        </Button>
      </div>
    </form>
  );
};
