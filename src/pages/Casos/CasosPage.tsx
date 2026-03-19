import { useSearchParams } from 'react-router-dom';
import { CasosTabla } from '../../components/casos/CasosTabla';
import { CasosFiltros } from '../../components/casos/CasosFiltros';

export const CasosPage = () => {
  const [searchParams] = useSearchParams();
  
  // Lecture of initial query params
  const beneficiarioId = searchParams.get('beneficiarioId');
  const estado = searchParams.get('estado');
  const profesionalId = searchParams.get('profesionalId');

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>Casos</h1>
      
      {/* 
        Demonstration of using the query params. 
        In the future these will be passed to a CasosFiltros data fetching hook or component state 
      */}
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Filtros activos por URL:</strong> 
        Beneficiario: {beneficiarioId || 'Ninguno'} | 
        Estado: {estado || 'Todos'} | 
        Profesional: {profesionalId || 'Todos'}
      </div>

      <CasosFiltros />
      <CasosTabla />
    </div>
  );
};
