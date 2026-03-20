import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends ComponentProps<'select'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, className = '', ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1 ${className}`}>
        {label && (
          <label className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          required={required}
          className={`
            h-[36px] w-full px-3 text-[13px] 
            bg-white dark:bg-[#242424] text-gray-900 dark:text-gray-100
            border rounded-[8px] outline-none transition-all duration-200
            appearance-none /* To style the arrow cleanly if we wanted, but native is fine unless requested */
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark/40'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        >
          <option value="" disabled hidden>Seleccionar...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-[11px] text-red-500 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
