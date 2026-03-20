import { useState, useRef, useEffect } from 'react';

export interface Column {
  id: string;
  label: string;
}

export interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onChange: (visibleColumns: string[]) => void;
}

export const ColumnSelector = ({ columns, visibleColumns, onChange }: ColumnSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColumn = (id: string) => {
    if (visibleColumns.includes(id)) {
      if (visibleColumns.length > 1) {
        onChange(visibleColumns.filter(c => c !== id));
      }
    } else {
      // Respect original column order when adding back
      const newVisible = [...visibleColumns, id];
      const sortedVisible = columns.filter(c => newVisible.includes(c.id)).map(c => c.id);
      onChange(sortedVisible);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm font-medium rounded-md transition-colors border-none bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer flex items-center gap-2"
        title="Ocultar/Mostrar columnas"
      >
        <span>⚙️</span> <span className="hidden sm:inline">Columnas</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 z-50 p-2 flex flex-col gap-1">
          {columns.map(col => (
            <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.id)}
                onChange={() => toggleColumn(col.id)}
                disabled={visibleColumns.length === 1 && visibleColumns.includes(col.id)}
                className="w-4 h-4 rounded text-primary focus:ring-primary dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50"
              />
              <span className={`text-sm select-none ${visibleColumns.includes(col.id) ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {col.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
