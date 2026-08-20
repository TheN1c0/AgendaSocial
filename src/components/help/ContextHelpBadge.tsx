import { useHelp } from '../../context/HelpContext';

interface ContextHelpBadgeProps {
  label?: string;
  className?: string;
}

export const ContextHelpBadge = ({ label = 'Guía de sección', className = '' }: ContextHelpBadgeProps) => {
  const { openSectionHelp } = useHelp();

  return (
    <button
      onClick={openSectionHelp}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 cursor-pointer ${className}`}
      title={label}
      aria-label={label}
    >
      <span className="font-bold text-xs leading-none">ⓘ</span>
      <span className="hidden sm:inline text-[11px] font-semibold">{label}</span>
    </button>
  );
};
