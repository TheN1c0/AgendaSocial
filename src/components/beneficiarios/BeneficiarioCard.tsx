import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import type { Beneficiario } from '../../types/beneficiarios.types';

interface BeneficiarioCardProps {
  beneficiario: Beneficiario;
}

export const BeneficiarioCard = ({ beneficiario: b }: BeneficiarioCardProps) => {
  return (
    <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar name={b.nombre} size="lg" className="w-[48px] h-[48px] text-lg" />
        <div>
          <h3 className="m-0 text-base font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{b.nombre}</h3>
          <span className="text-sm text-gray-500">{b.rut}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2 truncate" title={b.telefono}><span>📞</span> {b.telefono || 'Sin registrar'}</div>
        <div className="flex items-center gap-2 truncate" title={b.direccion}><span>📍</span> {b.direccion || 'Sin domicilio'}</div>
      </div>

      <div className="flex gap-4 border-y border-gray-100 dark:border-gray-800 py-3 mt-1">
         <div className="flex flex-col">
           <span className="text-xs text-gray-500">Casos activos</span>
           <div className="flex items-center gap-2 mt-1">
             <span className={`px-2 rounded-md font-bold text-sm ${b.casosActivos > 0 ? 'bg-primary/10 text-primary-dark' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
               {b.casosActivos}
             </span>
           </div>
         </div>
         <div className="flex flex-col">
           <span className="text-xs text-gray-500">Totales</span>
           <span className="font-bold text-gray-700 dark:text-gray-300 text-sm mt-1">{b.casosTotales}</span>
         </div>
         <div className="flex flex-col ml-auto text-right">
           <span className="text-xs text-gray-500">Profesional</span>
           <span className="font-medium text-gray-700 dark:text-gray-300 text-sm mt-1">{b.profesionalAsignado}</span>
         </div>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <Link to={`/beneficiarios/${b.id}`} className="text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors">
          Ver ficha
        </Link>
        <Link to={`/casos?beneficiarioId=${b.id}`} className="text-sm font-medium border border-primary text-primary rounded-lg px-3 py-2 text-center hover:bg-primary/5 transition-colors">
          Ver sus casos &rarr;
        </Link>
      </div>
    </div>
  );
};
