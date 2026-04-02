import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface CasoCardProps {
  id: string;
  beneficiario: string;
  estado: string;
  asignadoA: string;
}

export const CasoCard = ({ id, beneficiario, estado, asignadoA }: CasoCardProps) => {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{id}</span>
          <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem' }}>{beneficiario}</h4>
        </div>
        <Badge estado={estado.toLowerCase().replace(' ', '_') as any}>{estado}</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Avatar name={asignadoA} size="sm" />
        <span>Asignado a: <strong>{asignadoA}</strong></span>
      </div>
    </Card>
  );
};
