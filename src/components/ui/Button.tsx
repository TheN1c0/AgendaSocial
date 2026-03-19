import type { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none rounded-md ';
  const stateClasses = disabled 
    ? 'opacity-50 cursor-not-allowed ' 
    : 'hover:opacity-90 active:scale-95 cursor-pointer ';

  const variants = {
    primary: 'bg-primary text-white border border-transparent shadow-sm ',
    secondary: 'bg-transparent text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 ',
    danger: 'bg-red-100 text-red-800 border border-transparent dark:bg-red-900/40 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 '
  };

  const sizes = {
    sm: 'text-[12px] px-[12px] py-[6px] ',
    md: 'text-[13px] px-[16px] py-[8px] ',
    lg: 'text-[14px] px-[20px] py-[10px] '
  };

  const finalClassName = `${baseClasses}${stateClasses}${variants[variant] || variants.primary}${sizes[size] || sizes.md}${className}`.trim();

  return (
    <button 
      className={finalClassName} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
