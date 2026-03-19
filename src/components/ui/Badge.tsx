import type { ComponentProps, ReactNode } from 'react';

interface BadgeProps extends ComponentProps<'span'> {
  children: ReactNode;
  estado?: 'abierto' | 'en_proceso' | 'cerrado' | 'derivado';
  prioridad?: 'alta' | 'media' | 'baja';
}

export const Badge = ({ children, estado, prioridad, className = '', ...props }: BadgeProps) => {
  // Base classes for the pill shape, text size and padding
  let badgeClasses = 'inline-flex items-center rounded-full text-[11px] px-[8px] py-[2px] font-semibold tracking-wide leading-none ';

  if (estado) {
    switch (estado) {
      case 'abierto':
        badgeClasses += 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ';
        break;
      case 'en_proceso':
        badgeClasses += 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ';
        break;
      case 'cerrado':
        badgeClasses += 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 ';
        break;
      case 'derivado':
        badgeClasses += 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ';
        break;
    }
  } else if (prioridad) {
    switch (prioridad) {
      case 'alta':
        badgeClasses += 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 ';
        break;
      case 'media':
        badgeClasses += 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ';
        break;
      case 'baja':
        badgeClasses += 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ';
        break;
    }
  } else {
    // Fallback neutral badge if neither prop is provided
    badgeClasses += 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ';
  }

  return (
    <span className={`${badgeClasses.trim()} ${className}`} {...props}>
      {children}
    </span>
  );
};
