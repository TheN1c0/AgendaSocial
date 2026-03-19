import { useState, useEffect } from 'react';
import { Select } from './Select';
import { Button } from './Button';
import { Toast } from './Toast';
import { useTheme } from '../../context/ThemeContext';

const PREFERENCIAS_DEFAULT = {
  diasAnticipacionRevision: '3',
  diasSinActividad: '14',
  formatoFecha: 'DD/MM/YYYY',
  tema: 'sistema', // 'claro' | 'oscuro' | 'sistema'
};

export const PreferenciasForm = () => {
  const { setTheme } = useTheme();
  const [preferencias, setPreferencias] = useState(PREFERENCIAS_DEFAULT);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const prefs = localStorage.getItem('preferencias-usuario');
    if (prefs) {
      try {
        setPreferencias(JSON.parse(prefs));
      } catch (e) {}
    }
  }, []);

  const handleChangePref = (key: keyof typeof PREFERENCIAS_DEFAULT, value: string) => {
    const nextPrefs = { ...preferencias, [key]: value };
    setPreferencias(nextPrefs);
    if (key === 'tema') {
       setTheme(value as 'light' | 'dark' | 'system');
    }
  };

  const handleSavePref = () => {
    localStorage.setItem('preferencias-usuario', JSON.stringify(preferencias));
    setToastMessage('Preferencias guardadas permanentemente');
    setShowToast(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {showToast && <Toast mensaje={toastMessage} tipo="success" onClose={() => setShowToast(false)} />}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notificarme antes de una revisión</label>
        <div className="flex items-center gap-4">
          <Select 
            value={preferencias.diasAnticipacionRevision} 
            onChange={e => handleChangePref('diasAnticipacionRevision', e.target.value)}
            options={[
              { value: '1', label: '1 día de anticipación' },
              { value: '2', label: '2 días de anticipación' },
              { value: '3', label: '3 días de anticipación' },
              { value: '7', label: '1 semana antes' },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alertar casos sin actividad después de</label>
        <div className="flex items-center gap-4">
          <Select 
            value={preferencias.diasSinActividad} 
            onChange={e => handleChangePref('diasSinActividad', e.target.value)}
            options={[
              { value: '7', label: '7 días inactivos' },
              { value: '14', label: '14 días inactivos' },
              { value: '30', label: '1 mes inactivo' },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formato de fecha</label>
        <div className="flex items-center gap-6">
          {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(fmt => (
            <label key={fmt} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="fecha-fmt" 
                value={fmt} 
                checked={preferencias.formatoFecha === fmt}
                onChange={() => handleChangePref('formatoFecha', fmt)}
                className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fmt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema y apariencia</label>
        <div className="flex items-center gap-6">
          {['claro', 'oscuro', 'sistema'].map(tm => (
            <label key={tm} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="tema" 
                value={tm} 
                checked={preferencias.tema === tm}
                onChange={() => handleChangePref('tema', tm)}
                className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">{tm}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button variant="secondary" onClick={handleSavePref}>
          Guardar preferencias
        </Button>
      </div>

    </div>
  );
};
