'use client';

import { memo } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
}

const colorMap = {
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo',
}: StatCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {trend && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p>}
        </div>
        <div className={cn('rounded-lg p-3', colorMap[color])}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
});
