interface CasosToolbarProps {
  totalCasos: number;
  vista: 'tabla' | 'tarjetas';
  onVistaChange: (vista: 'tabla' | 'tarjetas') => void;
}

export const CasosToolbar = ({ totalCasos, vista, onVistaChange }: CasosToolbarProps) => {
  return (
    <div className="flex justify-between items-center py-2 h-10">
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        Mostrando <span className="font-bold text-gray-900 dark:text-gray-100">{totalCasos}</span> casos
      </div>
      
      <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-lg border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onVistaChange('tabla')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border-none cursor-pointer ${
            vista === 'tabla' 
              ? 'bg-white dark:bg-[#2a2a2a] text-primary shadow-sm' 
              : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          ☰ Tabla
        </button>
        <button
          onClick={() => onVistaChange('tarjetas')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border-none cursor-pointer ${
            vista === 'tarjetas' 
              ? 'bg-white dark:bg-[#2a2a2a] text-primary shadow-sm' 
              : 'bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          ☷ Tarjetas
        </button>
      </div>
    </div>
  );
};
