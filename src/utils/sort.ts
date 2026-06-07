import type { SortConfig } from '@/types';

export function sortByField<T>(items: T[], sort?: SortConfig): T[] {
  if (!sort) return items;

  return [...items].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sort.field];
    const bVal = (b as Record<string, unknown>)[sort.field];

    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const comparison = String(aVal).localeCompare(String(bVal), undefined, {
      numeric: true,
      sensitivity: 'base',
    });

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function filterBySearch<T>(items: T[], search: string, fields: (keyof T)[]): T[] {
  if (!search.trim()) return items;
  const query = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => String(item[field]).toLowerCase().includes(query))
  );
}
