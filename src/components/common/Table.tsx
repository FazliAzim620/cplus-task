'use client';

import { memo, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
}

function TableInner<T>({
  columns,
  data,
  keyExtractor,
  onSort,
  sortField,
  sortDirection,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm" role="table">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-3 font-medium text-slate-700 dark:text-slate-300',
                  col.sortable && 'cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800',
                  col.className
                )}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                aria-sort={
                  sortField === col.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {sortField === col.key && (
                    <span aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-slate-700 dark:text-slate-300', col.className)}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Table = memo(TableInner) as typeof TableInner;
