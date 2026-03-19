import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export const FichaBeneficiarioPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>Ficha Personal de Beneficiario: {id}</h1>
      <Card>
        <p>Datos personales, contexto familiar y resumen de casos asociados a esta persona.</p>
      </Card>
    </div>
  );
};
