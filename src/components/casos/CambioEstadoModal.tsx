import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ESTADOS } from '../../types/casos.types';
import type { EstadoCaso } from '../../types/casos.types';

interface CambioEstadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: EstadoCaso;
  onSave: (nuevoEstado: EstadoCaso, justificacion: string) => void;
}

export const CambioEstadoModal = ({ isOpen, onClose, currentState, onSave }: CambioEstadoModalProps) => {
  const [selectedState, setSelectedState] = useState<EstadoCaso>(currentState);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedState(currentState);
      setMotivo('');
    }
  }, [isOpen, currentState]);

  const handleSave = () => {
    if (selectedState !== currentState) {
      onSave(selectedState, motivo.trim());
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar estado del caso">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado actual:</p>
          <span className="inline-flex px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-semibold capitalize border border-gray-200 dark:border-gray-700">
            {currentState.replace('_', ' ')}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nuevo estado:</p>
          <div className="flex flex-col gap-3">
            {ESTADOS.map((estado) => {
              const isSelected = selectedState === estado;
              return (
                <label 
                  key={estado} 
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedState(estado as EstadoCaso)}
                >
                  <input
                    type="radio"
                    name="estado-caso"
                    value={estado}
                    checked={isSelected}
                    onChange={() => setSelectedState(estado as EstadoCaso)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-3 font-medium text-sm text-gray-900 dark:text-gray-100 capitalize">
                    {estado.replace('_', ' ')}
                  </span>
                  {currentState === estado && (
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 rounded-full">Actual</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div>
           <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Motivo del cambio (Opcional):
           </label>
           <textarea
             id="motivo"
             rows={3}
             className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-[#242424] dark:text-white"
             placeholder="Ej: Se completaron los objetivos iniciales. Se deriva a red de salud."
             value={motivo}
             onChange={(e) => setMotivo(e.target.value)}
           />
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={selectedState === currentState}>
            Guardar Cambio
          </Button>
        </div>
      </div>
    </Modal>
  );
};
