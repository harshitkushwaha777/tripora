import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'coral' | 'ivory' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'ivory',
  size = 'md',
  className,
}) => {
  const base = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    forest: 'bg-forest-100 text-forest-800 border border-forest-200/50',
    coral: 'bg-coral-100 text-coral-800 border border-coral-200/50',
    ivory: 'bg-ivory-200 text-ink-800 border border-ivory-300',
    outline: 'border border-ivory-300 text-ink-700 bg-white/70',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};
