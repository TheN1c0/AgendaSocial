import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const CasosFiltros = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
      <div style={{ flex: 1 }}>
        <Input placeholder="Buscar por nombre o ID..." style={{ marginBottom: 0 }} />
      </div>
      <div style={{ width: '200px' }}>
        <Select 
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'abierto', label: 'Abierto' },
            { value: 'en_proceso', label: 'En proceso' },
            { value: 'cerrado', label: 'Cerrado' }
          ]}
          style={{ marginBottom: 0 }}
        />
      </div>
    </div>
  );
};
