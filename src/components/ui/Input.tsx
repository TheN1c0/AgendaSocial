import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1 ${className}`}>
        {label && (
          <label className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          required={required}
          className={`
            h-[36px] w-full px-3 py-2 text-[13px] 
            bg-white dark:bg-[#242424] text-gray-900 dark:text-gray-100
            border rounded-[8px] outline-none transition-all duration-200
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark/40'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
          {...props}
        />
        {error ? (
          <span className="text-[11px] text-red-500 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
