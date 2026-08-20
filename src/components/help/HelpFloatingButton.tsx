import { useState, useRef, useEffect } from 'react';
import { useHelp } from '../../context/HelpContext';

export const HelpFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { startOnboarding, openGuiaRapida, openSectionHelp } = useHelp();

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={menuRef}>
      
      {/* POPUP MENU */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white dark:bg-[#222222] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden p-2 flex flex-col gap-1 animate-fadeIn">
          
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Centro de Ayuda
            </span>
            <h4 className="m-0 text-sm font-bold text-gray-900 dark:text-gray-100">
              Guía de Agenda Social
            </h4>
          </div>

          {/* OPTION 1: TOUR */}
          <button
            onClick={() => {
              setIsOpen(false);
              startOnboarding();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2b2b2b] text-left transition-colors border-none bg-transparent cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
              🚀
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Repetir Tour Guiado
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Paso a paso interactivo (4 pasos)
              </div>
            </div>
          </button>

          {/* OPTION 2: GUÍA RÁPIDA */}
          <button
            onClick={() => {
              setIsOpen(false);
              openGuiaRapida();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2b2b2b] text-left transition-colors border-none bg-transparent cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
              📖
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Guía Rápida de Uso
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Flujo operativo en 3 pasos
              </div>
            </div>
          </button>

          {/* OPTION 3: AYUDA DE SECCIÓN ACTUAL */}
          <button
            onClick={() => {
              setIsOpen(false);
              openSectionHelp();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2b2b2b] text-left transition-colors border-none bg-transparent cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
              💡
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                ¿Cómo usar esta sección?
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Consejos para la página actual
              </div>
            </div>
          </button>

        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir centro de ayuda"
        title="Centro de ayuda y guía de uso"
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-lg font-bold transition-all duration-200 border cursor-pointer ${
          isOpen
            ? 'bg-gray-800 text-white border-gray-700 rotate-45 scale-105'
            : 'bg-primary text-white border-primary-dark/20 hover:scale-110 hover:shadow-xl'
        }`}
        style={{
          boxShadow: isOpen ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(201, 122, 138, 0.5)'
        }}
      >
        {isOpen ? '✕' : '?'}
      </button>

    </div>
  );
};
