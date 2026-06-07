'use client';

import { memo, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { STATUS_COLORS } from '@/constants';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export const Badge = memo(function Badge({ children, variant, className }: BadgeProps) {
  const colorClass = variant ? STATUS_COLORS[variant] : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className
      )}
    >
      {children}
    </span>
  );
});
