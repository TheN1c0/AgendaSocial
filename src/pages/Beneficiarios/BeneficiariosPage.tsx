import { Card } from '../../components/ui/Card';
import { BeneficiarioBuscador } from '../../components/beneficiarios/BeneficiarioBuscador';

export const BeneficiariosPage = () => {
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>Directorio de Beneficiarios</h1>
      <BeneficiarioBuscador />
      <Card style={{ marginTop: '1.5rem' }}>
        <p>Listado completo de personas registradas en el sistema.</p>
      </Card>
    </div>
  );
};
