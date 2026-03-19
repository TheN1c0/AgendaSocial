import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export const DetalleCasoPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>Detalle de Caso: {id}</h1>
      <Card>
        <p>Toda la información del caso y su historial de intervenciones.</p>
      </Card>
    </div>
  );
};
