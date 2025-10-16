/**
 * Card Component (Presentation Layer)
 *
 * Reusable card container component.
 */

import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
