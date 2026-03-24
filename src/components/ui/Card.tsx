import type { ReactNode, ComponentProps } from 'react';

interface CardProps extends ComponentProps<'div'> {
  title?: string;
  children: ReactNode;
  padding?: string;
  noPadding?: boolean; // Keep for backwards compatibility with previous implementation if needed
  overflowVisible?: boolean;
}

export const Card = ({ title, children, padding, noPadding, overflowVisible, className = '', ...props }: CardProps) => {
  // If specific padding is provided, use it. If noPadding is true, use p-0. Otherwise default to p-4 (16px).
  const paddingClass = padding ? '' : noPadding ? 'p-0' : 'p-4';

  return (
    <div
      className={`bg-white dark:bg-[#242424] border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl ${overflowVisible ? 'overflow-visible relative z-20' : 'overflow-hidden'} ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="m-0 text-[13px] font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
      <div className={paddingClass} style={padding ? { padding } : {}}>
        {children}
      </div>
    </div>
  );
};
