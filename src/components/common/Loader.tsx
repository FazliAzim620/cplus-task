'use client';

import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export const Loader = memo(function Loader({ size = 'md', className, label = 'Loading' }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)} role="status" aria-label={label}>
      <Loader2 className={cn('animate-spin text-indigo-600 dark:text-indigo-400', sizeMap[size])} />
      <span className="sr-only">{label}</span>
    </div>
  );
});

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader size="lg" label="Loading page" />
    </div>
  );
});

export const Skeleton = memo(function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700', className)}
      aria-hidden="true"
    />
  );
});

export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
      <Skeleton className="mb-4 h-4 w-1/3" />
      <Skeleton className="mb-2 h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
});

export const TableSkeleton = memo(function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
});
