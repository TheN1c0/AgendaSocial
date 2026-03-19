import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import type { Beneficiario } from '../../types/beneficiarios.types';

interface BeneficiarioFilaProps {
  beneficiario: Beneficiario;
}

export const BeneficiarioFila = ({ beneficiario: b }: BeneficiarioFilaProps) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
      <td className="px-4 py-3">
        <Link to={`/beneficiarios/${b.id}`} className="flex items-center gap-3 group">
          <Avatar name={b.nombre} size="sm" />
          <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
            {b.nombre}
          </span>
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{b.rut}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{b.telefono || '-'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={b.profesionalAsignado} size="sm" className="w-[24px] h-[24px] text-[10px]" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{b.profesionalAsignado}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${b.casosActivos > 0 ? 'bg-primary/10 text-primary-dark' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {b.casosActivos}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {b.casosTotales}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{b.ultimaActividad}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
           <Link to={`/beneficiarios/${b.id}`} className="text-xs font-medium px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors whitespace-nowrap">
             Ver →
           </Link>
           <Link to={`/casos?beneficiarioId=${b.id}`} className="text-xs font-medium px-2 py-1 text-primary hover:bg-primary/10 rounded transition-colors whitespace-nowrap">
             Casos →
           </Link>
        </div>
      </td>
    </tr>
  );
};
