import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export const NuevoCasoPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedBeneficiarioId = searchParams.get('beneficiarioId');

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>Registrar Nuevo Caso</h1>
      <Card>
        <p>Formulario para registrar caso...</p>
        
        {preSelectedBeneficiarioId && (
          <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', color: '#075985', borderRadius: '4px', fontSize: '0.85rem', marginTop: '1rem' }}>
            Info: El beneficiario con ID <strong>{preSelectedBeneficiarioId}</strong> ha sido pre-seleccionado automáticamente.
          </div>
        )}
      </Card>
    </div>
  );
};
