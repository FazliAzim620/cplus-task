'use client';

import { memo } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  title = 'No items found',
  description = 'Get started by creating a new item.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
        <Inbox className="h-8 w-8 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
});
