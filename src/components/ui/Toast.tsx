import { useEffect, useState } from 'react';

interface ToastProps {
  mensaje: string;
  tipo: 'success' | 'error' | 'warning';
  duracion?: number; // ms, default 3000
  onClose?: () => void;
}

export const Toast = ({ mensaje, tipo, duracion = 3000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duracion);
    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  if (!visible) return null;

  const typeConfig = {
    success: { icon: '✓', colors: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
    error: { icon: '✕', colors: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
    warning: { icon: '⚠️', colors: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  };

  const config = typeConfig[tipo];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg font-medium text-sm ${config.colors}`}>
        <span className="text-lg leading-none">{config.icon}</span>
        <span>{mensaje}</span>
        <button 
          onClick={() => { setVisible(false); if(onClose) onClose(); }}
          className="ml-4 opacity-70 hover:opacity-100 bg-transparent border-none cursor-pointer leading-none text-xl p-0"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
