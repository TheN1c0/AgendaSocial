import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const BeneficiarioBuscador = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ flex: 1 }}>
        <Input 
          label="Buscar beneficiario existente" 
          placeholder="Ingrese RUT, nombre o documento..." 
          style={{ marginBottom: 0 }} 
        />
      </div>
      <div>
        <Button variant="secondary" style={{ marginBottom: '1rem' /* visual alignment with label */ }}>
          Buscar
        </Button>
      </div>
    </div>
  );
};
