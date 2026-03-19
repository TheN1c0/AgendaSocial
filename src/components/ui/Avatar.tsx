import type { ComponentProps } from 'react';

interface AvatarProps extends ComponentProps<'div'> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = ({ name, size = 'md', className = '', ...props }: AvatarProps) => {
  const initials = name
    .trim()
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeStyles = {
    sm: 'w-[24px] h-[24px] text-[10px]',
    md: 'w-[32px] h-[32px] text-[12px]',
    lg: 'w-[44px] h-[44px] text-[16px]'
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold bg-primary-light text-primary-dark shrink-0 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {initials || '?'}
    </div>
  );
};
