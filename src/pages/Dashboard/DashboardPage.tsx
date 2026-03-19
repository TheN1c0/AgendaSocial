import { useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Button } from '../../components/ui/Button';

export const DashboardPage = () => {
  const { data: users, isLoading, isError } = useUsers();

  useEffect(() => {
    document.title = 'Inicio | Agenda Social';
  }, []);

  if (isLoading) return <div>Cargando directorio...</div>;
  if (isError) return <div>Ocurrió un error al cargar la información.</div>;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bienvenido a Agenda Social</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Explora nuestro directorio de usuarios activos.</p>
      <ul style={{ marginBottom: '1rem', listStyle: 'none', padding: 0 }}>
        {users?.map(user => (
          <li key={user.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
      <Button variant="primary">Añadir Nuevo</Button>
    </main>
  );
};
