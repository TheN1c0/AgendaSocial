import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { beneficiariosService } from '../../services/beneficiariosService';
import type { Beneficiario } from '../../services/beneficiariosService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface BeneficiarioBuscadorProps {
  onSelect: (beneficiario: Beneficiario | null) => void;
  placeholder?: string;
  initialId?: string | null;
}

export const BeneficiarioBuscador = ({ onSelect, placeholder = 'Buscar por nombre o RUT...', initialId }: BeneficiarioBuscadorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Handle initialId manually
  useEffect(() => {
    if (initialId) {
      beneficiariosService.getBeneficiarioById(initialId)
        .then((b) => {
          setSelectedBeneficiario(b);
          onSelect(b);
        })
        .catch(console.error);
    }
  }, [initialId]);
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: resultados = [], isLoading } = useQuery({
    queryKey: ['beneficiarios', 'search', debouncedSearch],
    queryFn: () => beneficiariosService.getBeneficiarios(debouncedSearch),
    enabled: isOpen && !!debouncedSearch,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (b: Beneficiario) => {
    onSelect(b);
    setSelectedBeneficiario(b);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedBeneficiario(null);
    onSelect(null);
  };

  if (selectedBeneficiario) {
    return (
       <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg max-w-max">
         <span className="text-xl leading-none">👤</span>
         <div className="flex flex-col">
           <span className="text-sm font-semibold text-primary-dark dark:text-primary-light leading-tight">{selectedBeneficiario.nombre}</span>
           <span className="text-xs text-primary/70">{selectedBeneficiario.rut}</span>
         </div>
         <button onClick={handleClear} className="ml-2 text-primary hover:text-red-500 bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            ✕
         </button>
       </div>
    );
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => { if (searchTerm) setIsOpen(true); }}
      />
      
      {isOpen && debouncedSearch && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
          ) : resultados.length > 0 ? (
            <ul className="m-0 p-0 list-none divide-y divide-gray-100 dark:divide-gray-800">
              {resultados.map(b => (
                <li 
                  key={b.id} 
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                  onClick={() => handleSelect(b)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{b.nombre}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                      {b._count?.casos || 0} casos previos
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">RUT: {b.rut}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-3">No se encontraron resultados para "{debouncedSearch}"</p>
              <Button 
                variant="secondary" 
                className="w-full text-sm py-1.5" 
                onClick={() => {
                  console.log('Abrir modal de crear beneficiario');
                  setIsOpen(false);
                }}
              >
                + Crear beneficiario nuevo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
