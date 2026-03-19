import { Avatar } from '../ui/Avatar';

interface IntervencionItemProps {
  autor: { nombre: string; iniciales: string };
  descripcion: string;
  fecha: string;
  hora: string;
  isLast?: boolean;
}

export const IntervencionItem = ({ autor, descripcion, fecha, hora, isLast = false }: IntervencionItemProps) => {
  return (
    <div className="flex relative gap-4 mb-2">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute top-8 left-4 bottom-[-16px] w-[2px] bg-gray-200 dark:bg-gray-800" />
      )}
      
      <div className="relative z-10 pt-1 shrink-0">
        <Avatar name={autor.nombre} size="sm" className="w-[32px] h-[32px] text-xs ring-4 ring-white dark:ring-[#1a1a1a]" />
      </div>

      <div className="flex flex-col pb-4 w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{autor.nombre}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {fecha} a las {hora}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-[#242424] p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
          {descripcion}
        </div>
      </div>
    </div>
  );
};
