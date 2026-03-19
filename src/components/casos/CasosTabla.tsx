import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const CasosTabla = () => {
  const casos = [
    { id: '#4512', beneficiario: 'Ana G. Morales', estado: 'En proceso', fecha: 'hace 5 min' },
    { id: '#4511', beneficiario: 'Luis J. Pérez', estado: 'Abierto', fecha: 'hace 1 hora' },
    { id: '#4510', beneficiario: 'María L. Ruiz', estado: 'Cerrado', fecha: 'hace 2 horas' },
  ];

  return (
    <Card noPadding>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0 }}>Últimos casos actualizados</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Beneficiario</th>
            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {casos.map(caso => (
            <tr key={caso.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 500 }}>{caso.id}</td>
              <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{caso.beneficiario}</td>
              <td style={{ padding: '1rem 1.5rem' }}>
                <Badge variant={caso.estado === 'Abierto' ? 'success' : caso.estado === 'Cerrado' ? 'neutral' : 'info'}>
                  {caso.estado}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
