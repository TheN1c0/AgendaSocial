interface IntervencionItemProps {
  tipo: 'actualizo' | 'cerro' | 'abrio' | 'derivo';
  usuario: string;
  casoId: string;
  tiempo: string;
}

export const IntervencionItem = ({ tipo, usuario, casoId, tiempo }: IntervencionItemProps) => {
  const colorMap = {
    actualizo: '#C97A8A', // primary
    cerro: '#166534',     // green
    abrio: '#0ea5e9',     // blue
    derivo: '#d97706',    // yellow
  };

  const actionText = {
    actualizo: `actualizó ${casoId}`,
    cerro: `cerró ${casoId}`,
    abrio: `abrió ${casoId}`,
    derivo: `derivó ${casoId}`,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem 0' }}>
      <div style={{ 
        width: '10px', height: '10px', borderRadius: '50%', 
        backgroundColor: colorMap[tipo], 
        marginTop: '0.35rem', 
        flexShrink: 0 
      }} />
      <div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
          <strong>{usuario}</strong> {actionText[tipo]}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          {tiempo}
        </div>
      </div>
    </div>
  );
};
